const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const rideValidator = require("../validators/ride.validator");
const rideController = require("../controllers/ride.controller");

router.post(
  "/create",
  authMiddleware.authUser,
  rideValidator.rideValidator,
  rideController.createRide,
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  rideValidator.fareValidator,
  rideController.getFare,
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  rideValidator.confirmRideValidator,
  rideController.confirmRide,
);

router.get(
  "/start-ride",
  authMiddleware.authCaptain,
  rideValidator.startRideValidator,
  rideController.startRide,
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  rideValidator.confirmRideValidator,
  rideController.endRide,
);

module.exports = router;
