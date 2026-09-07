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
        <div className="text-right">
          <h2 className="text-lg font-medium">Karan</h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">KA 15 AK 0001</h4>
          <p className="text-sm text-gray-600">White Suzuki S-Presso LXI</p>
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

          <div className="flex items-center gap-5 p-2">
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
      </div>
    </div>
  );
};

export default WaitingForDriver;
