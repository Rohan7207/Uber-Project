import React, { useState } from "react";
import demoUser from "../assets/demo_user.jpg";
import { Link, useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleConfirm = () => {
    const isValidOtp = otp.length === 6;

    if (isValidOtp) {
      setErrorMessage("");
      navigate("/captain-riding");
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Confirm Ride to Start</h3>

      <div className="flex items-center justify-between p-3 border-2  border-yellow-300 rounded-lg mt-8 mb-2">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={demoUser}
            alt=""
          />
          <h2 className="text-lg font-medium">Harsh Patel</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      <div className="flex gap-3 flex-col justify-between items-center mt-4">
        <div className="w-full mt-4">
          <div className="flex items-center gap-3 p-3 border-b-2">
            <h4>
              {" "}
              <i className="text-lg ri-map-pin-2-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Karnataka
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border-b-2">
            <h4>
              {" "}
              <i className="ri-map-pin-user-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">Third Wave Coffee</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Karnataka
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <h4>
              {" "}
              <i className="ri-bank-card-fill"></i>
            </h4>
            <div>
              <h3 className="text-lg font-medium">₹193.20</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-2 w-full">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              className="bg-[#eee] px-6 py-3 font-mono  text-base rounded-lg mt-2 w-full"
              type="Number"
              placeholder="Enter OTP"
            />

            {/* Conditional Error Message */}
            {errorMessage && (
              <p className="text-red-500 mt-1 text-sm font-semibold text-center">
                {errorMessage}
              </p>
            )}

            <button
              onClick={handleConfirm}
              className="w-full mt-3 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
            >
              Confirm
            </button>

            <button
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
