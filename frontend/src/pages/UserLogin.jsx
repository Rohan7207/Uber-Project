import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = React.useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData,
      );

      if (response.status === 200) {
        setEmail("");
        setPassword("");

        const data = response.data;
        setUser(data.user);

        localStorage.setItem("token", data.token);

        navigate("/home");
      }
    } catch (error) {
      const message = error.response?.data?.errors?.[0]?.msg;

      console.log(message);
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="data:image/jpeg;base64,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"
          alt="Uber Logo"
        />
        <form
          className="w-full max-w-md"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your email?</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            autoComplete="off"
            placeholder="email@example.com"
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            autoComplete="off"
            placeholder="password"
          />
          <button className="bg-[#111]  text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          New here?{" "}
          <Link to="/signup" className="text-blue-600">
            Create a new Account
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/captain-login"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
