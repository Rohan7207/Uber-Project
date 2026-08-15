import React from "react";

const LocationSearchPanel = (props) => {
  // sample array for location
  const locations = [
    "24B, Near Kapoor's cafe, Shreyians Coding School, Bhopal",
    "22C, Near Malhotra>'s cafe, Shreyians Coding School, Bhopal",
    "18B, Near Sighanian's cafe, Shreyians Coding School, Bhopal",
    "10A, Near Khan's cafe, Shreyians Coding School, Bhopal",
  ];

  return (
    <div>
      {/* This is sample data */}
      {locations.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => {
            props.setVehiclePanelOpen(true);
            props.setPanelOpen(false);
          }}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black items-center my-2 justify-start"
        >
          <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full ">
            <i className="ri-map-pin-2-fill"></i>
          </h2>
          <h4 className="font-medium">{elem}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
