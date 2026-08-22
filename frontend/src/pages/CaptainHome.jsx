import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import map2 from "../assets/map2.gif";
import carImage from "../assets/car_png.jpg";
import homeUberLogo from "../assets/home_Uberlogo.png";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);
  const ridePopUpRef = useRef(null);

  useGSAP(
    function () {
      if (ridePopUpPanel) {
        gsap.to(ridePopUpRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopUpRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopUpPanel],
  );

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 w-full flex items-center justify-between">
        <img className="w-16" src={homeUberLogo} alt="" />
        <Link
          to="/captain-login"
          className="h-10  w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium  ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img className="h-full w-full object-cover" src={map2} alt="Map" />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopUpRef}
        className="fixed w-full translate-y-full z-10 px-3 py-6 pt-12  bg-white bottom-0"
      >
        <RidePopUp setRidePopUpPanel={setRidePopUpPanel} />
      </div>
    </div>
  );
};

export default CaptainHome;
