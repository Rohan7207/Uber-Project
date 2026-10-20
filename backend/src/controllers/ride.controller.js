const rideService = require("../services/ride.service");
const mapServices = require("../services/maps.service");
const { sendMessageToSocketId } = require("../../socket");
const rideModel = require("../models/ride.model");

async function createRide(req, res) {
  const { pickup, destination, vehicleType, fare, quoteId } = req.body;

  try {
    const createdRide = await rideService.createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType,
      fare,
      quoteId,
    );

    const rideRecord = createdRide?.ride || createdRide;
    const ride =
      rideRecord && typeof rideRecord.toObject === "function"
        ? rideRecord.toObject()
        : rideRecord;
    const ridePayload = {
      ...ride,
      vehicleType,
      ...(quoteId ? { quoteId } : {}),
      ...(createdRide?.otp ? { otp: createdRide.otp } : {}),
    };

    ride.otp = "";

    try {
      const pickupCoordinates = await mapServices.getAddressCoordinate(pickup);
      const ltd = Number(pickupCoordinates?.lat);
      const lng = Number(pickupCoordinates?.lng);
      const nearbyRadiusKm = 10;

      if (Number.isFinite(ltd) && Number.isFinite(lng)) {
        console.log("Pickup coordinates:", {
          ltd,
          lng,
          radius: nearbyRadiusKm,
        });

        const nearbyCaptains = await mapServices.getCaptainInTheRadius(
          ltd,
          lng,
          nearbyRadiusKm,
        );

        console.log("[Debug] Pickup:", { ltd, lng });
        console.log("[Debug] Nearby captains returned:", nearbyCaptains);
        console.log("[Debug] Nearby captains count:", nearbyCaptains?.length);

        const eligibleCaptains = (
          Array.isArray(nearbyCaptains) ? nearbyCaptains : []
        ).filter((captain) => {
          if (!captain || !captain._id || !captain.socketId) return false;
          if (captain.status && captain.status !== "active") return false;
          return true;
        });

        console.log(
          "[Debug] Captains before filtering:",
          (Array.isArray(nearbyCaptains) ? nearbyCaptains : []).map(
            (captain) => ({
              id: captain?._id?.toString(),
              socketId: captain?.socketId,
              status: captain?.status,
              location: captain?.location,
            }),
          ),
        );

        const uniqueCaptains = [];
        const seenCaptainIds = new Set();

        eligibleCaptains.forEach((captain) => {
          const captainId = captain._id?.toString();
          if (!captainId || seenCaptainIds.has(captainId)) return;
          seenCaptainIds.add(captainId);
          uniqueCaptains.push(captain);
        });

        const rideWithUser = await rideModel
          .findById(rideRecord._id)
          .populate("user", "fullname email");

        if (!rideWithUser) {
          throw new Error("Created ride not found");
        }

        console.log("Populated ride user:", rideWithUser?.user);
        console.log("Populated ride object:", rideWithUser?.toObject());

        const captainRidePayload = {
          ...rideWithUser.toObject(),
          vehicleType,
          ...(quoteId ? { quoteId } : {}),
        };

        uniqueCaptains.forEach((captain) => {
          // console.log(captain, ride);

          sendMessageToSocketId(
            captain.socketId,
            { ride: captainRidePayload },
            "new-ride-request",
          );
        });

        console.log("Nearby captains notified:", uniqueCaptains.length);
      }
    } catch (geoError) {
      console.warn(
        "Unable to notify nearby captains for ride request:",
        geoError.message,
      );
    }

    return res.status(201).json(createdRide);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message });
  }
}

async function getFare(req, res) {
  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.createFareQuote(
      req.user._id,
      pickup,
      destination,
    );

    return res.status(200).json(fare);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message });
  }
}

async function confirmRide(req, res) {
  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide(rideId, req.captain);

    console.log("Sending ride-confirmed to:", ride.user?.socketId);
    console.log("Confirmed ride:", ride.toObject());

    // Ride is confirmed we need to tell user that ride is accepted by captain
    sendMessageToSocketId(ride.user.socketId, ride, "ride-confirmed");

    return res.status(200).json(ride);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { createRide, getFare, confirmRide };
