const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/map.controller");
const mapValidator = require("../validators/map.validator");

router.get(
  "/get-coordinates",
  authMiddleware.authUser,
  mapValidator.coordinateValidator,
  mapController.getCoordinates,
);

router.get(
  "/get-distance-time",
  authMiddleware.authUser,
  mapValidator.distanceTimeValidator,
  mapController.getDistanceTime,
);

router.get(
  "/get-suggestions",
  authMiddleware.authUser,
  mapValidator.autoCompleteValidator,
  mapController.getAutoCompleteSuggestion,
);

module.exports = router;
