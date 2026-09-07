import React from "react";
import carImage from "../assets/car_png.jpg";
import bikeImage from "../assets/bike_png.jpg";
import autoImage from "../assets/auto.jpg";
import { formatAddress, formatPrice } from "../utils/formatters";

const LookingForDriver = (props) => {
  const imageMap = {
    car: carImage,
    motorcycle: bikeImage,
    auto: autoImage,
  };

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
        className="p-1 text-center w-[97%] absolute top-0"
        onClick={() => props.setVehicleFound(false)}
      >
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-1">Looking for a Driver</h3>

      <div className="flex gap-2 flex-col justify-between items-center">
        <img className="h-[7rem]" src={selectedImage} />

        <div className="flex items-center gap-3 p-2 border-b-2 w-full">
          <i className="ri-map-pin-user-fill"></i>

          <div>
            <h3 className="text-lg font-medium">Pickup</h3>
            <p
              className="text-sm -mt-1 text-gray-600 break-words whitespace-normal"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {pickupAddress}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 border-b-2 w-full">
          <i className="ri-map-pin-user-fill"></i>

          <div>
            <h3 className="text-lg font-medium">Destination</h3>
            <p
              className="text-sm -mt-1 text-gray-600 break-words whitespace-normal"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {destinationAddress}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 w-full">
          <i className="ri-bank-card-fill"></i>

          <div>
            <h3 className="text-lg font-medium">{formatPrice(selectedFare)}</h3>
            <p className="text-sm -mt-1 text-gray-600">Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
