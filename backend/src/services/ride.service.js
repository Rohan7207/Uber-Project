const crypto = require("crypto");
const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");
const { generateOtp } = require("../utils/otp.util");

const VEHICLE_RATES = {
  auto: { base: 30, perKm: 10, perMin: 1, minFare: 40 },
  car: { base: 50, perKm: 15, perMin: 2, minFare: 60 },
  motorcycle: { base: 20, perKm: 8, perMin: 0.8, minFare: 30 },
};

const QUOTE_TTL_MS = 10 * 60 * 1000;
const rideQuoteStore = new Map();

function normalizeFareAmount(rawFare) {
  if (typeof rawFare === "number" && Number.isFinite(rawFare) && rawFare > 0) {
    return Math.round(rawFare);
  }

  if (typeof rawFare === "string" && rawFare.trim() !== "") {
    const parsedValue = Number(rawFare);
    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      return Math.round(parsedValue);
    }
  }

  if (rawFare && typeof rawFare === "object") {
    const candidate =
      rawFare.estimatedFare ?? rawFare.amount ?? rawFare.total ?? rawFare.value;
    const parsedValue = Number(candidate);
    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      return Math.round(parsedValue);
    }
  }

  return null;
}

function isAllowedVehicleType(vehicleType) {
  return Boolean(vehicleType && VEHICLE_RATES[vehicleType]);
}

function createQuoteId() {
  return crypto.randomUUID();
}

function cleanExpiredQuotes() {
  const now = Date.now();

  for (const [quoteId, quote] of rideQuoteStore.entries()) {
    if (quote.expiresAt <= now) {
      rideQuoteStore.delete(quoteId);
    }
  }
}

async function getFare(pickup, destination, vehicleType) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const [originCoordinates, destinationCoordinates] = await Promise.all([
    mapService.getAddressCoordinate(pickup),
    mapService.getAddressCoordinate(destination),
  ]);

  const distanceTime = await mapService.getDistanceTime(
    originCoordinates.lat,
    originCoordinates.lng,
    destinationCoordinates.lat,
    destinationCoordinates.lng,
  );

  const distanceKm = Number(distanceTime.distance || 0);
  const durationMin = Number(distanceTime.duration || 0);

  const fares = {};

  Object.entries(VEHICLE_RATES).forEach(([key, rate]) => {
    const rawFare =
      rate.base + distanceKm * rate.perKm + durationMin * rate.perMin;
    const estimatedFare = Math.round(
      Number(Math.max(rate.minFare, rawFare).toFixed(2)),
    );

    fares[key] = {
      vehicle: key,
      base: rate.base,
      perKm: rate.perKm,
      perMin: rate.perMin,
      minFare: rate.minFare,
      estimatedFare,
    };
  });

  return {
    distance: distanceKm,
    distanceUnit: distanceTime.distanceUnit || "km",
    duration: durationMin,
    durationUnit: distanceTime.durationUnit || "minutes",
    fares,
    auto: fares.auto.estimatedFare,
    car: fares.car.estimatedFare,
    motorcycle: fares.motorcycle.estimatedFare,
    selected:
      vehicleType && fares[vehicleType]
        ? {
            vehicle: vehicleType,
            estimatedFare: fares[vehicleType].estimatedFare,
          }
        : undefined,
  };
}

async function createFareQuote(userId, pickup, destination) {
  if (!userId || !pickup || !destination) {
    throw new Error("User, pickup, and destination are required");
  }

  cleanExpiredQuotes();

  const fareData = await getFare(pickup, destination);
  const quoteId = createQuoteId();

  const quote = {
    quoteId,
    userId,
    pickup,
    destination,
    distance: fareData.distance,
    duration: fareData.duration,
    fares: fareData.fares,
    createdAt: Date.now(),
    expiresAt: Date.now() + QUOTE_TTL_MS,
  };

  rideQuoteStore.set(quoteId, quote);

  return {
    ...fareData,
    quoteId,
  };
}

function getValidQuote(quoteId, userId) {
  if (!quoteId || !userId) {
    return null;
  }

  cleanExpiredQuotes();

  const quote = rideQuoteStore.get(quoteId);
  if (!quote) {
    return null;
  }

  if (quote.userId.toString() !== userId.toString()) {
    return null;
  }

  if (quote.expiresAt <= Date.now()) {
    rideQuoteStore.delete(quoteId);
    return null;
  }

  return quote;
}

async function createRide(
  user,
  pickup,
  destination,
  vehicleType,
  fare,
  quoteId,
  otpDigits = 6,
) {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  let normalizedFare = normalizeFareAmount(fare);

  if (quoteId) {
    const validQuote = getValidQuote(quoteId, user);
    if (!validQuote) {
      throw new Error("Ride quote is invalid or expired.");
    }

    const selectedFare = validQuote.fares?.[vehicleType]?.estimatedFare;
    if (!isAllowedVehicleType(vehicleType) || !selectedFare) {
      throw new Error(
        "Selected vehicle is not available in the stored ride quote.",
      );
    }

    normalizedFare = Number(selectedFare);
  } else if (normalizedFare && isAllowedVehicleType(vehicleType)) {
    const minimumFare = VEHICLE_RATES[vehicleType].minFare || 0;
    if (normalizedFare < minimumFare) {
      throw new Error("Fare provided for the selected vehicle is invalid.");
    }
  } else {
    const quote = await getFare(pickup, destination, vehicleType);
    normalizedFare = normalizeFareAmount(
      quote?.selected?.estimatedFare ?? quote?.[vehicleType],
    );
  }

  if (!normalizedFare) {
    throw new Error("Unable to determine a valid fare for this ride.");
  }

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    fare: normalizedFare,
  });

  const otp = generateOtp(otpDigits);

  return { ride, otp };
}

module.exports = {
  getFare,
  createFareQuote,
  createRide,
};
