import React from "react";
import demoUser from "../assets/demo_user.jpg";
import { Link, useNavigate } from "react-router-dom";
import { formatAddress, formatPrice } from "../utils/formatters";
import axios from "axios";

const FinishRide = (props) => {
  const passenger = props.ride?.user || props.user || {};
  const passengerName =
    [passenger.fullname?.firstname, passenger.fullname?.lastname]
      .filter(Boolean)
      .join(" ") ||
    [passenger.fullName?.firstName, passenger.fullName?.lastName]
      .filter(Boolean)
      .join(" ") ||
    passenger.name ||
    "Passenger";

  const pickupAddress = formatAddress(
    props.ride?.pickup || props.pickup || "Pickup location",
  );

  const destinationAddress = formatAddress(
    props.ride?.destination || props.destination || "Destination location",
  );

  const cashAmount =
    props.ride?.fare ??
    props.fare?.fares?.[props.vehicleType]?.estimatedFare ??
    props.fare?.[props.vehicleType] ??
    0;

  const distance = props.ride?.distance;

  const navigate = useNavigate();

  async function endRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
      {
        rideId: props.ride._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (response.status === 200) {
      props.setFinishRidePanel(false);
      navigate("/captain-home");
    }
  }

  return (
    <div>
      <h5
        className=" p-1 text-center w-[97%] absolute top-0 "
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>

      <div className="flex items-center justify-between p-4 border-2 border-yellow-300 rounded-lg mt-8 mb-2">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={passenger.profileImage || demoUser}
            alt="Passenger"
          />
          <h2 className="text-lg font-medium capitalize">{passengerName}</h2>
        </div>
        <h5 className="text-lg font-semibold">{distance} KM</h5>
      </div>

      <div className="flex gap-3 flex-col justify-between items-center mt-5">
        <div className="w-full mt-4">
          <div className="flex items-center gap-3 p-3 border-b-2">
            <h4>
              {" "}
              <i className="text-lg ri-map-pin-2-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border-b-2">
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

          <div className="flex items-center gap-3 p-3">
            <h4>
              {" "}
              <i className="ri-bank-card-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">{formatPrice(cashAmount)}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.paymentMethod || "Cash"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
          <button
            onClick={endRide}
            className="w-full mt-6 flex text-lg justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
          >
            Finish Ride
          </button>

          <p className=" mt-10 text-xs">
            Click on Finish ride button if you have completed the payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
