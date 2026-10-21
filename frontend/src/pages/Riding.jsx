import React, { useContext, useEffect } from "react";
import carImage from "../assets/car_png.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatAddress, formatPrice } from "../utils/formatters";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {}; // Retrive ride data

  const pickupAddress = formatAddress(ride?.pickup || "Pickup location");

  const destinationAddress = formatAddress(
    ride?.destination || "Destination location",
  );

  const fare = ride?.fare ?? 0;

  const captain = ride?.captain || {};
  const captainName =
    [captain.fullname?.firstname, captain.fullname?.lastname]
      .filter(Boolean)
      .join(" ") || "Your Captain";

  const vehicle = captain.vehicle || {};
  const vehiclePlate = vehicle.plate || "Plate unavailable";

  const vehicleDescription = [vehicle.color, vehicle.vehicleType]
    .filter(Boolean)
    .join(" ");

  const navigate = useNavigate();
  const { connected, sendEvent, onEvent } = useSocket();

  // Send ride confirmed to user
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = onEvent("ride-ended", (ride) => {
      console.log("[User] Received ride-ended:", ride);

      navigate("/home");
    });

    return unsubscribe;
  }, [connected, onEvent]);

  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed top-2 right-2 h-10  w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-2-line"></i>
      </Link>

      <div className="h-1/2">
        <LiveTracking />
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between right-2">
          <img className="h-[5rem]" src={carImage} alt="Car_image" />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">{captainName}</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {vehiclePlate}
            </h4>
            <p className="text-sm text-gray-600">{vehicleDescription}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-col justify-between items-center">
          <div className="w-full mt-3">
            <div className="flex items-center gap-5 p-2 border-b-2">
              <h4>
                {" "}
                <i className="text-lg ri-map-pin-2-fill"></i>
              </h4>
              <div>
                <h3 className="text-lg font-medium">Pickup</h3>
                <p className="text-sm -mt-1 text-gray-600">{pickupAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-2 border-b-2">
              <h4>
                <i className="text-lg ri-map-pin-user-fill"></i>
              </h4>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {destinationAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-2">
              <h4>
                {" "}
                <i className="ri-bank-card-fill"></i>
              </h4>
              <div>
                <h3 className="text-lg font-medium">{formatPrice(fare)}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full mt-3 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
