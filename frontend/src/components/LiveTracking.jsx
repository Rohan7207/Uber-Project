import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const pickupIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 22px;
      height: 22px;
      background: #2563eb;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 30px; height: 30px;
    background: #dc2626;
    border: 2px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 1px 6px #555;
  "></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const captainIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    background: white;
    border: 2px solid #2563eb;
    border-radius: 50%;
    box-shadow: 0 2px 6px #555;
    font-size: 22px;
  ">🚗</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const FitMapToMarkers = ({
  captainLocation,
  pickupLocation,
  destinationLocation,
}) => {
  const map = useMap();

  React.useEffect(() => {
    const positions = [
      captainLocation,
      pickupLocation,
      destinationLocation,
    ].filter(
      (position) =>
        Array.isArray(position) &&
        position.length === 2 &&
        position.every(Number.isFinite),
    );

    if (positions.length === 1) {
      map.setView(positions[0], 15);
    } else if (positions.length > 1) {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 15 });
    }
  }, [map, captainLocation, pickupLocation, destinationLocation]);

  return null;
};

const LiveTracking = ({
  captainLocation,
  pickupLocation,
  destinationLocation,
}) => {
  const defaultPosition = [12.9716, 77.5946]; // Bengaluru fallback

  const center = captainLocation || pickupLocation || defaultPosition;

  const apiKey = import.meta.env.LOCATIONIQ_API_KEY;

  return (
    <>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom
        className="h-full w-full"
      >
        {apiKey ? (
          <TileLayer
            url={`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${apiKey}`}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; LocationIQ'
            subdomains={["a", "b", "c"]}
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        )}

        <FitMapToMarkers
          captainLocation={captainLocation}
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
        />

        {captainLocation && (
          <Marker position={captainLocation} icon={captainIcon}>
            <Popup>Captain's current location</Popup>
          </Marker>
        )}

        {pickupLocation && (
          <Marker position={pickupLocation} icon={pickupIcon}>
            <Popup>Pickup location</Popup>
          </Marker>
        )}

        {destinationLocation && (
          <Marker position={destinationLocation} icon={destinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default LiveTracking;
