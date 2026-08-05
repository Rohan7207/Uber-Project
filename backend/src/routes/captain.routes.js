const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");

router.post(
  "/register",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid Email"),
    body("fullname.firstname")
      .trim()
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),

    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Color of vehicle must be at least 3 characters long"),

    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Plate of vehicle must be at least 3 characters long"),

    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity of vehicle must be at least 1 characters long"),

    body("vehicle.vehicleType")
      .isIn(["car", "motorcycle", "auto"])
      .withMessage("Invalid vehicle type"),
  ],
  captainController.registerCaptain,
);

module.exports = router;
