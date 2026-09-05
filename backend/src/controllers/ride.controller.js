const rideService = require("../services/ride.service");

async function createRide(req, res) {
  const { pickup, destination, vehicleType, fare, quoteId } = req.body;

  try {
    const ride = await rideService.createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType,
      fare,
      quoteId,
    );

    return res.status(201).json(ride);
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
