import React, { useState } from "react";
import demoUser from "../assets/demo_user.jpg";
import { useNavigate } from "react-router-dom";
import { formatAddress, formatPrice } from "../utils/formatters";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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

  const handleConfirm = (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage("Enter a valid 6-digit OTP.");
      return;
    }

    setErrorMessage("");

    // Keep the existing navigation for now.
    navigate("/captain-riding");
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Confirm Ride to Start</h3>

      <div className="flex items-center justify-between p-3 border-2 border-yellow-300 rounded-lg mt-8 mb-2">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={passenger.profileImage || demoUser}
            alt="Passenger"
          />
          <h2 className="text-lg font-medium">{passengerName}</h2>
        </div>

        <h5 className="text-lg font-semibold">
          {distance != null ? `${distance} km` : "Distance unavailable"}
        </h5>
      </div>

      <div className="flex gap-3 flex-col justify-between items-center mt-4">
        <div className="w-full mt-4">
          <div className="flex items-center gap-3 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill" />
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill" />
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {destinationAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <i className="text-lg ri-bank-card-fill" />
            <div>
              <h3 className="text-lg font-medium">{formatPrice(cashAmount)}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.paymentMethod || "Cash"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 w-full">
          <form onSubmit={handleConfirm}>
            <input
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setErrorMessage("");
              }}
              className="bg-[#eee] px-6 py-3 font-mono text-base rounded-lg mt-2 w-full"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              aria-label="Ride OTP"
            />

            {errorMessage && (
              <p className="text-red-500 mt-1 text-sm font-semibold text-center">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-3 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopUpPanel(false);
                props.setRidePopUpPanel(false);
              }}
              className="w-full mt-2 text-lg bg-red-600 text-white font-semibold p-3 rounded-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
