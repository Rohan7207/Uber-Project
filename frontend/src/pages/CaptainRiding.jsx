import React, { useRef, useState } from "react";
import homeUberLogo from "../assets/home_Uberlogo.png";
import map2 from "../assets/map2.gif";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel],
  );

  return (
    <div className="h-screen relative">
      <div className="fixed p-6 top-0 w-full flex items-center justify-between">
        <img className="w-16" src={homeUberLogo} alt="" />
        <Link
          to="/captain-login"
          className="h-10  w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium  ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-4/5">
        <img className="h-full w-full object-cover" src={map2} alt="Map" />
      </div>

      <div className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 ">
        <h5
          onClick={() => {
            setFinishRidePanel(true);
          }}
          className="p-1 text-center w-[85%] absolute top-0"
        >
          <i className="text-3xl text-gray-500 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">4 KM away</h4>
        <button
          onClick={() => {
            setFinishRidePanel(true);
          }}
          className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
        >
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 px-3 py-6 pt-12 translate-y-full bg-white bottom-0"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
