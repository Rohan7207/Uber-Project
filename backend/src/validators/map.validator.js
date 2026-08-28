const { query, validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

const distanceTimeValidator = [
  query("origin")
    .trim()
    .notEmpty()
    .withMessage("Origin is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Origin must be between 2 and 200 characters"),

  query("destination")
    .trim()
    .notEmpty()
    .withMessage("Destination is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Destination must be between 2 and 200 characters"),

  validateRequest,
];

const coordinateValidator = [
  query("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Address must be between 3 and 200 characters"),

  validateRequest,
];

const autoCompleteValidator = [
  query("input")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters"),

  validateRequest,
];

module.exports = {
  distanceTimeValidator,
  coordinateValidator,
  autoCompleteValidator,
};
