import React from "react";
import map from "../assets/map_image.gif";
import carImage from "../assets/car_png.jpg";
import { Link } from "react-router-dom";

const Riding = () => {
  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed top-2 right-2 h-10  w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-2-line"></i>
      </Link>

      <div className="h-1/2">
        <img className="h-full w-full object-cover" src={map} alt="Map" />
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between right-2">
          <img className="h-[5rem]" src={carImage} alt="Car_image" />
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
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  Kankariya Talab, Karnataka
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-2">
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
        </div>

        <button className="w-full mt-3 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
