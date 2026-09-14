const rideService = require("../services/ride.service");
const mapServices = require("../services/maps.service");
const { sendMessageToSocketId } = require("../../socket");

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

    try {
      const pickupCoordinates = await mapServices.getAddressCoordinate(pickup);
      const ltd = Number(pickupCoordinates?.lat);
      const lng = Number(pickupCoordinates?.lng);
      const nearbyRadiusKm = 5;

      if (Number.isFinite(ltd) && Number.isFinite(lng)) {
        const nearbyCaptains = await mapServices.getCaptainInTheRadius(
          ltd,
          lng,
          nearbyRadiusKm,
        );

        const eligibleCaptains = (
          Array.isArray(nearbyCaptains) ? nearbyCaptains : []
        ).filter((captain) => {
          if (!captain || !captain._id || !captain.socketId) return false;
          if (captain.status && captain.status !== "active") return false;
          return true;
        });

        const uniqueCaptains = [];
        const seenCaptainIds = new Set();

        eligibleCaptains.forEach((captain) => {
          const captainId = captain._id?.toString();
          if (!captainId || seenCaptainIds.has(captainId)) return;
          seenCaptainIds.add(captainId);
          uniqueCaptains.push(captain);
        });

        uniqueCaptains.forEach((captain) => {
          sendMessageToSocketId(
            captain.socketId,
            { ride: ridePayload },
            "new-ride-request",
          );
        });
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

module.exports = { createRide, getFare };
