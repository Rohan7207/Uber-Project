const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");
const { generateOtp } = require("../utils/otp.util");

async function getFare(pickup, destination, vehicleType) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  // Get coordinates for both addresses
  const originCoordinates = await mapService.getAddressCoordinate(pickup);
  const destinationCoordinates =
    await mapService.getAddressCoordinate(destination);

  // Get distance (km) and duration (minutes)
  const distanceTime = await mapService.getDistanceTime(
    originCoordinates.lat,
    originCoordinates.lng,
    destinationCoordinates.lat,
    destinationCoordinates.lng,
  );

  const distanceKm = Number(distanceTime.distance || 0);
  const durationMin = Number(distanceTime.duration || 0);

  // Define pricing rules for each vehicle type
  const vehicleRates = {
    auto: { base: 30, perKm: 10, perMin: 1, minFare: 40 },
    car: { base: 50, perKm: 15, perMin: 2, minFare: 60 },
    motorcycle: { base: 20, perKm: 8, perMin: 0.8, minFare: 30 },
  };

  // Calculate estimated fares
  const fares = {};

  Object.entries(vehicleRates).forEach(([key, rate]) => {
    const rawFare =
      rate.base + distanceKm * rate.perKm + durationMin * rate.perMin;
    const estimatedFare = Number(Math.max(rate.minFare, rawFare).toFixed(2));

    fares[key] = {
      vehicle: key,
      base: rate.base,
      perKm: rate.perKm,
      perMin: rate.perMin,
      minFare: rate.minFare,
      estimatedFare,
    };
  });

  // expose numeric fare values at top-level for backward compatibility
  const topLevelFareValues = {};
  Object.keys(fares).forEach((k) => {
    topLevelFareValues[k] = fares[k].estimatedFare;
  });

  return {
    distance: distanceKm,
    distanceUnit: distanceTime.distanceUnit || "km",
    duration: durationMin,
    durationUnit: distanceTime.durationUnit || "minutes",
    fares,
    ...topLevelFareValues,
    // If a specific vehicleType is requested, include a selected fare summary
    selected:
      vehicleType && fares[vehicleType]
        ? {
            vehicle: vehicleType,
            estimatedFare: fares[vehicleType].estimatedFare,
          }
        : undefined,
  };
}

async function createRide(
  user,
  pickup,
  destination,
  vehicleType,
  otpDigits = 6,
) {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination, vehicleType);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    fare: fare[vehicleType],
  });

  const otp = generateOtp(otpDigits);

  return { ride, otp };
}

module.exports = {
  getFare,
  createRide,
};
