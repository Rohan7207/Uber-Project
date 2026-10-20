import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// It checks if user exists in database it returns that children and if not it returns that user to login page
const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!cancelled && response.status === 200) {
          setUser(response.data);
          setIsLoading(false);
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "[UserProtectedWrapper] Profile request failed:",
          err.response?.status,
          err.response?.data,
        );

        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [token, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
