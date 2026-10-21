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

const RecenterMap = ({ position }) => {
  const map = useMap();

  React.useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

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

      <RecenterMap position={center} />

      {captainLocation && (
        <Marker position={captainLocation}>
          <Popup>Captain's current location</Popup>
        </Marker>
      )}

      {pickupLocation && (
        <Marker position={pickupLocation}>
          <Popup>Pickup location</Popup>
        </Marker>
      )}

      {destinationLocation && (
        <Marker position={destinationLocation}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default LiveTracking;
