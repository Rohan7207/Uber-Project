import React, { useRef, useState } from "react";
import homeLogo from "../assets/map_image.gif";
import { useGSAP } from "@gsap/react"; //  GSAP is animation hook
import gsap from "gsap";

const Home = () => {
  const [pickUp, setPickUp] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
        });
      }
    },
    [panelOpen],
  );

  return (
    <div className="h-screen relative">
      <img
        className="w-16 absolute left-5  top-5"
        src={homeLogo}
        alt="Home_Uber_Logo"
      />

      <div className="h-screen w-screen">
        {/* Image for temporary use */}
        <img className="h-full w-full object-cover" src={homeLogo} alt="Map" />
      </div>

      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full ">
        <div className="h-[30%] bg-white p-6 relative">
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[42%] left-10 bg-gray-900 rounded-full"></div>
            <input
              onClick={(e) => {
                setPanelOpen(true);
              }}
              value={pickUp}
              onChange={(e) => {
                setPickUp(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2  text-base rounded-lg mt-4 w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={(e) => {
                setPanelOpen(true);
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2  text-base rounded-lg mt-3 w-full"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
        </div>

        <div ref={panelRef} className="h-0 bg-red-500"></div>
      </div>
    </div>
  );
};

export default Home;
