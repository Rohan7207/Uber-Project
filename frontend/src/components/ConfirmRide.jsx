import React from "react";
import carImage from "../assets/car_png.jpg";

const ConfirmRide = () => {
  return (
    <div>
      <h5
        className=" pl-14 text-center w-[95%] absolute "
        // onClick={() => {
        //   props.setVehiclePanelOpen(false);
        // }}
      >
        <i className="text-2xl text-black-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-1">Confirm your Ride</h3>
      <div className="flex gap-2 flex-col justify-between items-center">
        <img className="h-[7rem]" src={carImage} alt="Car_image" />
        <div className="w-full mt-3">
          <div className="flex items-center gap-3 p-2 border-b-2">
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

          <div className="flex items-center gap-3 p-2 border-b-2">
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

          <div className="flex items-center gap-3 p-2">
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

        <button className="w-full mt-3 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
