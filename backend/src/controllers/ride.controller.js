const rideService = require("../services/ride.service");

async function createRide(req, res) {
  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType,
    );

    return res.status(201).json(ride);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

async function getFare(req, res) {
  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);

    return res.status(200).json(fare);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { createRide, getFare };
