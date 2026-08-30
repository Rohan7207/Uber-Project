import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import map from "../assets/map_image.gif";
import homoUberLogo from "../assets/home_Uberlogo.png";
import { useGSAP } from "@gsap/react"; //  GSAP is animation hook
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";

const Home = () => {
  const [pickUp, setPickUp] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusedField, setFocusedField] = useState("pickup");
  const [queryTimeout, setQueryTimeout] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const confirmRidePanelRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const vehicleFoundRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const waitingForDriverRef = useRef(null);
  const [fare, setFare] = useState({});
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    return () => {
      if (queryTimeout) clearTimeout(queryTimeout);
    };
  }, [queryTimeout]);

  const fetchSuggestions = async (input) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res && res.data) setSuggestions(res.data);
    } catch (err) {
      console.error("Autocomplete error", err?.response || err.message);
      setSuggestions([]);
    }
  };

  const scheduleFetch = (value) => {
    if (queryTimeout) clearTimeout(queryTimeout);
    const t = setTimeout(() => {
      const v = value?.trim() || "";
      if (v.length >= 2) fetchSuggestions(v);
      else setSuggestions([]);
    }, 300);

    setQueryTimeout(t);
  };

  async function findTrip() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setVehiclePanelOpen(true);
    setPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
      setFare(response.data || {});
    } catch (err) {
      console.error("Error fetching fare", err?.response || err.message);
    }
  }

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen],
  );

  useGSAP(
    function () {
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanelOpen],
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel],
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound],
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver],
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src={homoUberLogo}
        alt="Home_Uber_Logo"
      />

      <div
        onClick={() => {
          setVehiclePanelOpen(false);
        }}
        className="h-screen w-screen"
      >
        {/* Image for temporary use */}
        <img className="h-full w-full object-cover" src={map} alt="Map" />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full ">
        <div className="h-[30%] bg-white relative px-6 pt-6">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold mb-4">Find a trip</h4>

          <form className="relative" onSubmit={(e) => submitHandler(e)}>
            {/* Connecting line */}
            <div className="absolute left-[18px] top-[20px] h-[52px] w-[2px] bg-gray-800 rounded-full z-0"></div>

            {/* Pickup */}
            <div className="relative z-10 flex items-center">
              <div className="w-9 flex justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-900"></div>
              </div>

              <input
                onClick={() => {
                  setPanelOpen(true);
                  setFocusedField("pickup");
                }}
                value={pickUp}
                onChange={(e) => {
                  setPickUp(e.target.value);
                  setFocusedField("pickup");
                  scheduleFetch(e.target.value);
                }}
                className="bg-[#eee] px-4 py-3 text-base rounded-lg w-full"
                type="text"
                placeholder="Add a pick-up location"
              />
            </div>

            {/* Destination */}
            <div className="relative z-10 flex items-center mt-3">
              <div className="w-9 flex justify-center">
                <div className="w-3 h-3 bg-gray-900 rounded-sm"></div>
              </div>

              <input
                onClick={() => {
                  setPanelOpen(true);
                  setFocusedField("destination");
                }}
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setFocusedField("destination");
                  scheduleFetch(e.target.value);
                }}
                className="bg-[#eee] px-4 py-3 text-base rounded-lg w-full"
                type="text"
                placeholder="Enter your destination"
              />
            </div>
          </form>
        </div>

        <div ref={panelRef} className="h-0 bg-white px-6">
          {
            <LocationSearchPanel
              setPanelOpen={setPanelOpen}
              setVehiclePanelOpen={setVehiclePanelOpen}
              onFindTrip={findTrip}
              suggestions={suggestions}
              onSelectSuggestion={(item) => {
                const value =
                  typeof item === "string"
                    ? item
                    : item.displayName ||
                      item.display_name ||
                      item.display_name ||
                      item.display;

                if (focusedField === "pickup") setPickUp(value);
                else setDestination(value);

                setSuggestions([]);
              }}
            />
          }
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 px-3 py-10 pt-12 translate-y-full bg-white bottom-0"
      >
        <VehiclePanel
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 px-3 py-6 pt-12 translate-y-full bg-white bottom-0"
      >
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 px-3 py-6 pt-12 translate-y-full bg-white bottom-0"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-10 px-3 py-6 pt-12 translate-y-full bg-white bottom-0"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
