import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setvehicleType] = useState("");

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newCaptainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType: vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        newCaptainData,
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setvehicleType("");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe3e8] py-3 px-4 flex flex-col justify-center">
      <div className="w-full max-w-[420px] mx-auto bg-white p-3 sm:p-4 rounded-[2px] shadow-sm">
        <img
          className="w-20 mb-2"
          src="data:image/png;base64,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"
          alt="Uber Logo"
        />
        <form
          className="w-full"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-[18px] font-medium mb-3">
            What's our Captain's name
          </h3>
          <div className="flex gap-3 mb-2">
            <input
              className="bg-[#eeeeee] w-1/2 rounded-md px-4 py-2 border border-[#e2e2e2] text-base placeholder:text-base"
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              type="text"
              placeholder="First name"
            />
            <input
              className="bg-[#eeeeee] w-1/2 rounded-md px-4 py-2 border border-[#e2e2e2] text-base placeholder:text-base"
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              type="text"
              placeholder="Last name"
            />
          </div>

          <h3 className="text-[18px] font-medium mb-3">
            What's our Captain's email?
          </h3>
          <input
            className="bg-[#eeeeee] mb-2 rounded-md px-4 py-2 border border-[#e2e2e2] w-full text-base placeholder:text-base"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            autoComplete="off"
            placeholder="email@example.com"
          />
          <h3 className="text-[18px] font-medium mb-3">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-2 rounded-md px-4 py-2 border border-[#e2e2e2] w-full text-base placeholder:text-base"
            type="password"
            autoComplete="new-password"
            placeholder="password"
          />

          <h3 className="text-[18px] font-medium mb-3">Vehicle Information</h3>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <input
              className="bg-[#eeeeee] rounded-md px-4 py-2 border border-[#e2e2e2] text-base placeholder:text-base"
              required
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              type="text"
              placeholder="Vehicle Color"
            />
            <input
              className="bg-[#eeeeee] rounded-md px-4 py-2 border border-[#e2e2e2] text-base placeholder:text-base"
              required
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              type="text"
              placeholder="Vehicle Plate"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <input
              className="bg-[#eeeeee] rounded-md px-4 py-2 border border-[#e2e2e2] text-base placeholder:text-base"
              required
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              type="number"
              min="1"
              placeholder="Vehicle Capacity"
            />
            <select
              className="bg-[#eeeeee] rounded-md px-4 py-2 border border-[#e2e2e2] text-base appearance-none"
              required
              value={vehicleType}
              onChange={(e) => setvehicleType(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>

          <button className="bg-[#111] text-white font-semibold mt-3 mb-2 rounded-md px-4 py-2 w-full text-lg">
            Create Captain account
          </button>
        </form>
        <p className="text-center mb-8">
          Already have a account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
