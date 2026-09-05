const axios = require("axios");

// In-memory cache for normalized address -> coordinates.
// This resets automatically when the Node.js server restarts.
const geocodeCache = new Map();

function normalizeAddressKey(address) {
  return String(address || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isValidCoordinate(value, axis) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return false;
  }

  if (axis === "lat" && (numericValue < -90 || numericValue > 90)) {
    return false;
  }

  if (axis === "lng" && (numericValue < -180 || numericValue > 180)) {
    return false;
  }

  return true;
}

function isLikelyGenericGeocodeResult(result) {
  if (!result) return true;

  const displayName = String(result.display_name || "").trim();
  const type = String(result.type || result.class || "")
    .trim()
    .toLowerCase();
  const lowercaseDisplay = displayName.toLowerCase();
  const commaCount = (displayName.match(/,/g) || []).length;

  const genericValues = [
    "india",
    "karnataka",
    "uttara kannada",
    "andhra pradesh",
    "maharashtra",
    "tamil nadu",
    "state",
    "country",
    "world",
  ];

  if (!displayName) return true;
  if (genericValues.includes(lowercaseDisplay)) return true;
  if (!type && commaCount === 0) return true;
  if (type === "country" || type === "state" || type === "province") {
    return true;
  }

  return false;
}

function pickBestGeocodeResult(results, originalAddress) {
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(
      `Unable to find a precise location for "${originalAddress}"`,
    );
  }

  const cleanedResults = results
    .map((item) => {
      const lat = Number(item?.lat);
      const lng = Number(item?.lon);

      if (
        !item ||
        !item.display_name ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return null;
      }

      if (!isValidCoordinate(lat, "lat") || !isValidCoordinate(lng, "lng")) {
        return null;
      }

      return {
        ...item,
        lat,
        lng,
      };
    })
    .filter(Boolean);

  if (cleanedResults.length === 0) {
    throw new Error(
      `Unable to find a precise location for "${originalAddress}"`,
    );
  }

  const scoredResults = cleanedResults.map((item) => {
    const displayName = String(item.display_name || "");
    const lowerDisplay = displayName.toLowerCase();
    const commaCount = (displayName.match(/,/g) || []).length;
    const type = String(item.type || item.class || "").toLowerCase();

    let score = 0;
    if (commaCount > 0) score += 3;
    if (type && !["country", "state", "province"].includes(type)) score += 2;
    if (lowerDisplay.includes(originalAddress.toLowerCase())) score += 2;
    if (type === "village" || type === "hamlet" || type === "town") score += 4;
    if (type === "city" || type === "suburb" || type === "neighbourhood")
      score += 3;

    return { item, score };
  });

  scoredResults.sort((a, b) => b.score - a.score);

  const bestMatch = scoredResults[0].item;

  if (isLikelyGenericGeocodeResult(bestMatch)) {
    throw new Error(
      `Unable to find a precise location for "${originalAddress}"`,
    );
  }

  return {
    lat: bestMatch.lat,
    lng: bestMatch.lng,
    displayName: bestMatch.display_name,
    type: bestMatch.type || bestMatch.class || "unknown",
  };
}

module.exports.getAddressCoordinate = async (address) => {
  if (!address || typeof address !== "string") {
    throw new Error("Address argument is missing or invalid");
  }

  const normalizedAddress = normalizeAddressKey(address);
  if (geocodeCache.has(normalizedAddress)) {
    console.log("[Geo] Cache hit for:", normalizedAddress);
    return geocodeCache.get(normalizedAddress);
  }

  try {
    const url = "https://us1.locationiq.com/v1/search";

    const response = await axios.get(url, {
      params: {
        key: process.env.LOCATIONIQ_API_KEY,
        q: address.trim(),
        format: "json",
        limit: 5,
        addressdetails: 1,
        dedupe: 1,
      },
    });

    if (
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      const notFoundError = new Error(
        `Unable to find a precise location for "${address}"`,
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const selectedMatch = pickBestGeocodeResult(response.data, address);

    console.log("[Geo] Address:", address);
    console.log("[Geo] Display Name:", selectedMatch.displayName);
    console.log("[Geo] Type:", selectedMatch.type);
    console.log("[Geo] Latitude:", selectedMatch.lat);
    console.log("[Geo] Longitude:", selectedMatch.lng);

    const coordinates = {
      lat: selectedMatch.lat,
      lng: selectedMatch.lng,
    };

    geocodeCache.set(normalizedAddress, coordinates);
    return coordinates;
  } catch (error) {
    console.error(
      "[Geo] LocationIQ error:",
      error.response?.data || error.message,
    );

    if (error.response?.status === 429) {
      const rateLimitError = new Error(
        "Location service is temporarily rate-limited. Please try again shortly.",
      );
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }

    if (error.statusCode) {
      throw error;
    }

    throw error;
  }
};

module.exports.getDistanceTime = async (startLat, startLng, endLat, endLng) => {
  if (
    !Number.isFinite(startLat) ||
    !Number.isFinite(startLng) ||
    !Number.isFinite(endLat) ||
    !Number.isFinite(endLng)
  ) {
    const invalidCoordinatesError = new Error(
      "Routing could not be calculated because the coordinates are invalid.",
    );
    invalidCoordinatesError.statusCode = 400;
    throw invalidCoordinatesError;
  }

  if (
    startLat < -90 ||
    startLat > 90 ||
    endLat < -90 ||
    endLat > 90 ||
    startLng < -180 ||
    startLng > 180 ||
    endLng < -180 ||
    endLng > 180
  ) {
    const invalidCoordinatesError = new Error(
      "Routing could not be calculated because the coordinates are out of valid range.",
    );
    invalidCoordinatesError.statusCode = 400;
    throw invalidCoordinatesError;
  }

  try {
    const url = `https://us1.locationiq.com/v1/directions/driving/${startLng},${startLat};${endLng},${endLat}`;

    console.log("[Routing] Requesting route between coordinates:", {
      start: { lat: startLat, lng: startLng },
      end: { lat: endLat, lng: endLng },
    });

    const response = await axios.get(url, {
      params: {
        key: process.env.LOCATIONIQ_API_KEY,
        overview: "false",
      },
    });

    if (
      response.data &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      const primaryRoute = response.data.routes[0];

      const distanceKm = Number((primaryRoute.distance / 1000).toFixed(2));
      const durationMinutes = Number((primaryRoute.duration / 60).toFixed(2));

      console.log("[Routing] Distance:", distanceKm, "km");
      console.log("[Routing] Duration:", durationMinutes, "minutes");

      return {
        distance: distanceKm,
        distanceUnit: "km",
        duration: durationMinutes,
        durationUnit: "minutes",
      };
    }

    const noRouteError = new Error(
      "The selected pickup and destination could not be connected by road.",
    );
    noRouteError.statusCode = 404;
    throw noRouteError;
  } catch (error) {
    console.error(
      "[Routing] LocationIQ Routing Service Error:",
      error.response?.data || error.message,
    );

    if (error.response?.status === 429) {
      const rateLimitError = new Error(
        "Location service is temporarily rate-limited. Please try again shortly.",
      );
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }

    if (error.response?.data?.code === "NoRoute") {
      const noRouteError = new Error(
        "The selected pickup and destination could not be connected by road.",
      );
      noRouteError.statusCode = 404;
      throw noRouteError;
    }

    if (error.statusCode) {
      throw error;
    }

    const routingError = new Error("Unable to calculate route at this time.");
    routingError.statusCode = 500;
    throw routingError;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input || typeof input !== "string" || !input.trim()) {
    throw new Error("Query is required");
  }

  try {
    const url = "https://us1.locationiq.com/v1/autocomplete.php";

    const response = await axios.get(url, {
      params: {
        key: process.env.LOCATIONIQ_API_KEY,
        q: input.trim(),
        format: "json",
        limit: 5,
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid response from LocationIQ");
    }

    const suggestions = response.data.map((item) => ({
      place_id: item.place_id ?? item.osm_id ?? null,
      displayName: item.display_name ?? null,
      lat: item.lat ? parseFloat(item.lat) : null,
      lon: item.lon ? parseFloat(item.lon) : null,
      type: item.type ?? null,
      address: item.address ?? null,
      boundingbox: item.boundingbox ?? null,
    }));

    return suggestions;
  } catch (error) {
    console.error(
      "LocationIQ Autocomplete Error:",
      error.response?.data || error.message,
    );

    throw new Error("Unable to fetch autocomplete suggestions");
  }
};
