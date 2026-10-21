import React from "react";
import demoUser from "../assets/demo_user.jpg";
import { formatAddress, formatPrice } from "../utils/formatters";

const RidePopUp = (props) => {
  const ride = props.ride;

  const pickupAddress = formatAddress(ride?.pickup || "Pickup location");
  const destinationAddress = formatAddress(
    ride?.destination || "Destination location",
  );

  const cashAmount = ride?.fare ?? 0;

  return (
    <div>
      <h5
        className=" p-1 text-center w-[97%] absolute top-0 "
        onClick={() => {
          props.setRidePopUpPanel(false);
        }}
      >
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>

      <div className="flex items-center justify-between p-2 bg-yellow-400 rounded-lg mt-2 mb-2">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={demoUser}
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {[
              props.ride?.user?.fullname?.firstname,
              props.ride?.user?.fullname?.lastname,
            ]
              .filter(Boolean)
              .join(" ") || "Customer"}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">{props.ride?.distance} KM</h5>
      </div>

      <div className="flex gap-2 flex-col justify-between items-center">
        <div className="w-full mt-4">
          <div className="flex items-center gap-3 p-4 border-b-2">
            <h4>
              {" "}
              <i className="text-lg ri-map-pin-2-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border-b-2">
            <h4>
              <i className="text-lg ri-map-pin-user-fill"></i>
            </h4>
            <div className="min-w-0">
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600 break-words">
                {destinationAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <h4>
              {" "}
              <i className="ri-bank-card-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">{formatPrice(cashAmount)}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between mt-3">
          <button
            onClick={() => {
              props.setRidePopUpPanel(false);
            }}
            className=" bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg"
          >
            Ignore
          </button>

          <button
            onClick={() => {
              props.setConfirmRidePopUpPanel(true);
              props.confirmRide();
            }}
            className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
