import React, { useRef, useState, useEffect, useContext } from "react";
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
import { useSocket } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionStatus, setSuggestionStatus] = useState("idle");
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
  const [quoteId, setQuoteId] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [fareLoading, setFareLoading] = useState(false);
  const [fareError, setFareError] = useState("");

  const navigate = useNavigate();

  const { connected, sendEvent, onEvent } = useSocket();
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (!user || !connected) return;

    sendEvent("join", {
      userId: user._id,
      userType: "user",
    });
  }, [user, connected]);

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

      const data = Array.isArray(res?.data) ? res.data : [];
      setSuggestions(data);
      setSuggestionStatus(data.length ? "success" : "not-found");
    } catch (err) {
      console.error("Autocomplete error", err?.response || err.message);
      setSuggestions([]);
      setSuggestionStatus("error");
    }
  };

  const scheduleFetch = (value) => {
    if (queryTimeout) clearTimeout(queryTimeout);
    const t = setTimeout(() => {
      const v = value?.trim() || "";
      if (v.length >= 2) fetchSuggestions(v);
      else {
        setSuggestions([]);
        setSuggestionStatus("idle");
      }
    }, 300);

    setQueryTimeout(t);
  };

  async function findTrip() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (fareLoading) return;

    setFareLoading(true);
    setFareError("");
    setFare({});
    setQuoteId("");
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

      const responseData = response.data || {};
      setFare(responseData.fares ? responseData : {});
      setQuoteId(responseData.quoteId || "");
    } catch (err) {
      console.error("Error fetching fare", err?.response || err.message);
      setFare({});
      setQuoteId("");
      setFareError(
        err?.response?.data?.message || "Unable to calculate fare right now.",
      );
    } finally {
      setFareLoading(false);
    }
  }

  async function createRide() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setVehiclePanelOpen(true);
    setPanelOpen(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType: selectedVehicle,
          fare:
            fare?.fares?.[selectedVehicle]?.estimatedFare ??
            fare?.[selectedVehicle],
          quoteId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
    } catch (err) {
      console.error("Error creating ride", err?.response || err.message);
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
      if (!confirmRidePanelRef.current) return;
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
      if (!vehicleFoundRef.current) return;
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
      if (!waitingForDriverRef.current) return;
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
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
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

        {/* Location Panel */}
        <div ref={panelRef} className="h-0 bg-white px-6">
          {
            <LocationSearchPanel
              setPanelOpen={setPanelOpen}
              setVehiclePanelOpen={setVehiclePanelOpen}
              onFindTrip={findTrip}
              suggestions={suggestions}
              suggestionStatus={suggestionStatus}
              searchQuery={focusedField === "pickup" ? pickup : destination}
              onSelectSuggestion={(item) => {
                const value =
                  typeof item === "string"
                    ? item
                    : item.displayName ||
                      item.display_name ||
                      item.display_name ||
                      item.display;

                if (focusedField === "pickup") setPickup(value);
                else setDestination(value);

                setSuggestions([]);
                setSuggestionStatus("idle");
              }}
            />
          }
        </div>
      </div>

      {/* Vehicles Panel */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 px-3 py-10 pt-12 translate-y-full bg-white bottom-0"
      >
        <VehiclePanel
          fare={fare}
          fareLoading={fareLoading}
          fareError={fareError}
          setSelectedVehicle={setSelectedVehicle}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      {confirmRidePanel && (
        <div
          ref={confirmRidePanelRef}
          className="fixed w-full z-10 px-3 py-6 pt-12 translate-y-full bg-white bottom-0"
        >
          <ConfirmRide
            pickup={pickup}
            destination={destination}
            fare={fare}
            createRide={createRide}
            vehicleType={selectedVehicle}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </div>
      )}

      {vehicleFound && (
        <div
          ref={vehicleFoundRef}
          className="fixed w-full z-10 px-3 py-6 pt-12 translate-y-full bg-white bottom-0"
        >
          <LookingForDriver
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={selectedVehicle}
            setVehicleFound={setVehicleFound}
          />
        </div>
      )}

      {waitingForDriver && (
        <div
          ref={waitingForDriverRef}
          className="fixed w-full z-10 px-3 py-6 pt-12 translate-y-full bg-white bottom-0"
        >
          <WaitingForDriver
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={selectedVehicle}
            setWaitingForDriver={setWaitingForDriver}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
