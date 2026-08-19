import React from "react";
import carImage from "../assets/car_png.jpg";
import bikeImage from "../assets/bike_png.jpg";
import autoImage from "../assets/auto.jpg";

const VehiclePanel = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[95%] absolute top-0 "
        onClick={() => {
          props.setVehiclePanelOpen(false);
        }}
      >
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
        }}
        className="flex border-2 mb-2 active:border-black rounded-xl  w-full p-3 items-center justify-between"
      >
        <img className="h-[3.9rem]" src={carImage} alt="Car Image" />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberGo{" "}
            <span>
              <i className="ri-user-3-fill">4</i>
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-norma; text-xs text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹193.20</h2>
      </div>

      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
        }}
        className="flex border-2 mb-2 active:border-black rounded-xl  w-full p-3 items-center justify-between"
      >
        <img className="h-10" src={bikeImage} alt="Car Image" />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            Moto{" "}
            <span>
              <i className="ri-user-3-fill">1</i>
            </span>
          </h4>
          <h5 className="font-medium text-sm">3 mins away </h5>
          <p className="font-norma; text-xs text-gray-600">
            Affordabl motorcycle rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹65.17</h2>
      </div>

      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
        }}
        className="flex border-2 mb-2 active:border-black rounded-xl  w-full p-3 items-center justify-between"
      >
        <img className="h-12" src={autoImage} alt="Car Image" />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberAuto{" "}
            <span>
              <i className="ri-user-3-fill">3</i>
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-norma; text-xs text-gray-600">
            Affordable Auto rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹118.21</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
