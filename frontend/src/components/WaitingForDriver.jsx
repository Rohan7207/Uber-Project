import React from "react";
import carImage from "../assets/car_png.jpg";
import bikeImage from "../assets/bike_png.jpg";
import autoImage from "../assets/auto.jpg";
import { formatAddress, formatPrice } from "../utils/formatters";

const WaitingForDriver = (props) => {
  const imageMap = {
    car: carImage,
    motorcycle: bikeImage,
    auto: autoImage,
  };

  const captain = props.ride?.captain || {};
  const captainName = captain.fullname
    ? `${captain.fullname.firstname || ""} ${captain.fullname.lastname || ""}`.trim()
    : "Captain details unavailable";

  const vehicle = captain.vehicle || {};

  const selectedImage = imageMap[props.vehicleType] || carImage;
  const selectedFare =
    props.fare?.fares?.[props.vehicleType]?.estimatedFare ??
    props.fare?.[props.vehicleType] ??
    0;
  const pickupAddress = formatAddress(props.pickup || "Pickup location");
  const destinationAddress = formatAddress(
    props.destination || "Destination location",
  );

  return (
    <div>
      <h5
        className=" p-1 text-center w-[97%] absolute top-0 "
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
      >
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex items-center justify-between">
        <img className="h-[5rem]" src={selectedImage} alt="Ride vehicle" />
        <div className="text-right p-1">
          <h2 className="text-lg font-medium mb-1">{captainName}</h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {vehicle.plate || "Vehicle number unavailable"}
          </h4>
          <p className="text-sm text-gray-600">
            {[vehicle.color, vehicle.vehicleType].filter(Boolean).join(" ") ||
              "Vehicle details unavailable"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-col justify-between items-center">
        <div className="w-full mt-3">
          {/* Pickup */}
          <div className="flex items-start gap-3 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm text-gray-600 break-words">
                {pickupAddress}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm text-gray-600 break-words">
                {destinationAddress}
              </p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-3 p-3">
            <i className="text-lg ri-bank-card-fill" />
            <div>
              <h3 className="text-lg font-medium">
                {formatPrice(props.ride?.fare ?? selectedFare)}
              </h3>
              <p className="text-sm text-gray-600">
                {props.ride?.paymentMethod || "Cash"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
