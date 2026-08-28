const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

async function getCoordinates(req, res, next) {
  const { address } = req.query;

  //  Ensure address isn't empty or undefined
  if (!address) {
    return res
      .status(400)
      .json({ message: "Address query parameter is required" });
  }

  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    res.status(200).json({
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(404).json({ message: "Coordinates not found" });
  }
}

async function getDistanceTime(req, res, next) {
  try {
    const { origin, destination } = req.query;

    const originCoordinates = await mapService.getAddressCoordinate(origin);

    const destinationCoordinates =
      await mapService.getAddressCoordinate(destination);

    const distanceTime = await mapService.getDistanceTime(
      originCoordinates.lat,
      originCoordinates.lng,
      destinationCoordinates.lat,
      destinationCoordinates.lng,
    );

    res.status(200).json(distanceTime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAutoCompleteSuggestion(req, res, next) {
  try {
    const { input } = req.query;

    const suggestions = await mapService.getAutoCompleteSuggestions(input);

    res.status(200).json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getCoordinates, getDistanceTime, getAutoCompleteSuggestion };
