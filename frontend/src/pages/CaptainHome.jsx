import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import carImage from "../assets/car_png.jpg";
import homeUberLogo from "../assets/home_Uberlogo.png";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useSocket } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const ridePopUpRef = useRef(null);
  // const [newRideRequest, setNewRideRequest] = useState(null);

  const [ride, setRide] = useState(null);

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpRef = useRef(null);

  const { connected, sendEvent, onEvent } = useSocket();
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!connected) return;

    const cleanup = onEvent("new-ride-request", (data) => {
      const incomingRide = data?.ride ?? data;

      console.log("New ride request:", incomingRide);
      console.log("Ride user:", incomingRide?.user);

      setRide(incomingRide);
      setRidePopUpPanel(true);
    });

    return cleanup;
  }, [connected, onEvent]);

  useEffect(() => {
    if (!captain || !connected) return;

    sendEvent("join", {
      userId: captain._id,
      userType: "captain",
    });

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported on this browser.");
      return undefined;
    }

    const updateCaptainLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          sendEvent("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: latitude,
              lng: longitude,
            },
          });
        },
        (error) => {
          console.warn("Unable to fetch captain location:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 5000,
        },
      );
    };

    updateCaptainLocation();
    const locationInterval = setInterval(updateCaptainLocation, 10000);

    return () => clearInterval(locationInterval);
  }, [captain, connected, sendEvent]);

  async function confirmRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return response;
  }

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

  useGSAP(
    function () {
      if (confirmRidePopUpPanel) {
        gsap.to(confirmRidePopUpRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopUpRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopUpPanel],
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
        <LiveTracking />
      </div>

      {/* {newRideRequest && (
        <div className="absolute left-4 right-4 top-20 z-20 rounded-2xl bg-white p-4 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            New ride request
          </p>
          <h3 className="mt-2 text-lg font-bold text-gray-900">
            {newRideRequest.pickup}
          </h3>
          <p className="text-sm text-gray-600">
            To: {newRideRequest.destination}
          </p>
          <p className="mt-2 text-sm font-medium text-green-600">
            Fare: ₹{newRideRequest.fare}
          </p>
        </div>
      )} */}

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopUpRef}
        className="fixed w-full translate-y-full z-10 px-3 py-6 pt-12  bg-white bottom-0"
      >
        <RidePopUp
          ride={ride}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopUpRef}
        className="fixed w-full h-screen translate-y-full z-10 px-3 py-6 pt-12  bg-white bottom-0"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
