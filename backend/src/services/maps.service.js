const axios = require("axios");

// 1. Get Coordinates from Address (Geocoding)
module.exports.getAddressCoordinate = async (address) => {
  if (!address || typeof address !== "string") {
    throw new Error("Address argument is missing or invalid");
  }

  try {
    const url = "https://us1.locationiq.com/v1/search";

    const response = await axios.get(url, {
      params: {
        key: process.env.LOCATIONIQ_API_KEY,
        q: address,
        format: "json",
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const topMatch = response.data[0];

      return {
        lat: parseFloat(topMatch.lat),
        lng: parseFloat(topMatch.lon),
      };
    }

    throw new Error("No matching spatial records found");
  } catch (error) {
    console.log("LOCATIONIQ ERROR:");
    console.log(error.response?.data || error.message);

    throw error;
  }
};

// 2. Get Route Distance & Time (For Pricing Calculations & ETAs)
module.exports.getDistanceTime = async (startLat, startLng, endLat, endLng) => {
  try {
    const url = `https://us1.locationiq.com/v1/directions/driving/${startLng},${startLat};${endLng},${endLat}`;

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

      return {
        distance: distanceKm,
        distanceUnit: "km",
        duration: durationMinutes,
        durationUnit: "minutes",
      };
    }

    throw new Error("No valid route found");
  } catch (error) {
    console.error(
      "LocationIQ Routing Service Error:",
      error.response?.data || error.message,
    );

    throw new Error("Unable to fetch distance parameters");
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
