import React from "react";
import carImage from "../assets/car_png.jpg";
import bikeImage from "../assets/bike_png.jpg";
import autoImage from "../assets/auto.jpg";
import { formatAddress, formatPrice } from "../utils/formatters";

const ConfirmRide = (props) => {
  const imageMap = {
    car: carImage,
    motorcycle: bikeImage,
    auto: autoImage,
  };

  const vehicleType = props.vehicleType || "car";
  const selectedImage = imageMap[vehicleType] || carImage;
  const selectedFare =
    props.fare?.fares?.[vehicleType]?.estimatedFare ??
    props.fare?.[vehicleType] ??
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
          props.setConfirmRidePanel(false);
        }}
      >
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-1">Confirm your Ride</h3>
      <div className="flex gap-2 flex-col justify-between items-center">
        <img className="h-[7rem]" src={selectedImage} alt="Ride vehicle" />
        <div className="w-full mt-3">
          <div className="flex items-center gap-3 p-2 border-b-2">
            <h4>
              {" "}
              <i className="text-lg ri-map-pin-2-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-b-2">
            <h4>
              {" "}
              <i className="ri-map-pin-user-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {destinationAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <h4>
              {" "}
              <i className="ri-bank-card-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">
                {formatPrice(selectedFare)}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            props.setVehicleFound(true);
            props.setConfirmRidePanel(false);
            props.createRide();
          }}
          className="w-full mt-3 bg-green-600 text-white font-semibold p-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
