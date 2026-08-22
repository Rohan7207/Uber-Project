import React from "react";
import demoUser from "../assets/demo_user.jpg";

const CaptainDetails = () => {
  return (
    <div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={demoUser}
            alt=""
          />
          <h4 className="text-lg font-medium">Harsh Patel</h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">₹295.20</h4>
          <p className="text-sm  text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-6 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-time-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-2xl font-thin ri-speed-up-fill"></i>
          <h5 className="mt-1 text-lg font-medium">30KM</h5>
          <p className="text-sm text-gray-600">Total Distance</p>
        </div>
        <div className="text-center">
          <i className="text-2xl font-thin ri-sticky-note-line"></i>
          <h5 className="mt-1 text-lg font-medium">20</h5>
          <p className="text-sm text-gray-600">Total PickUp</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
