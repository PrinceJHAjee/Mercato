import React from "react";
import { useEffect, useCallback, useState } from "react";
import { Avatar, Badge, message } from "antd";
import { GetCurrentUser, RefreshToken } from "../apicalls/Users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/lodersSlice";
import { SetUser } from "../redux/usersSlice";
import Notifications from "./Notifications";
import {
  GetAllNotifications,
  ReadAllNotifications,
} from "../apicalls/notifications";

function ProtectedPage({ children, isDarkMode, toggleDarkMode }) {
  const [notifications = [], setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useSelector((state) => state.users.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateToken = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      console.log("GetCurrentUser response:", response); // Log the response
      if (response.success) {
        //dispatching the user data to the redux store
        dispatch(SetUser(response.data));
      }

      //to add logic to refresh the token if it expires:
      else {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const newTokenResponse = await RefreshToken(refreshToken);

          if (newTokenResponse.success) {
            localStorage.setItem("token", newTokenResponse.data);
            validateToken(); // Call validateToken again with the new token
          } else {
            message.error("Session has expired. Please log in again.");
            navigate("/login");
          }
        } else {
          message.error("Session has expired. Please log in again.");
          navigate("/login");
        }
      }
    } catch (error) {
      dispatch(SetLoader(false));
      //Update the validateToken function to handle expired tokens properly, clear the expired token from localStorage, and redirect to the login page.
      localStorage.removeItem("token");
      navigate("/login");
      message.error(error.message);
    }
  }, [navigate, dispatch]);

  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications();

      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const readNotifications = async () => {
    try {
      const response = await ReadAllNotifications();
      if (response.success) {
        getNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    } else {
      navigate("/login");
    }
  }, [navigate, validateToken]);

  return (
    user && (
      <div
        className={
          isDarkMode
            ? "dark bg-[#121212] text-[#e0e0e0]"
            : "bg-white text-[#333]"
        }
      >
        {/* header */}
        <div
          className={`flex justify-between items-center p-5 flex-col md:flex-row ${
            isDarkMode ? "bg-[#1c1c1c]" : "bg-primary"
          }`}
        >
          <h1
            className={`text-2xl cursor-pointer mb-2 md:mb-0 ${
              isDarkMode ? "text-primary" : "text-white"
            }`}
            onClick={() => navigate("/")}
          >
            Mercato
          </h1>
          <div
            className={`py-2 px-5 rounded flex gap-2 items-center ${
              isDarkMode ? "bg-[#2c2c2c]" : "bg-white"
            }`}
          >
            <span
              className={`cursor-pointer uppercase ${
                isDarkMode ? "text-primary" : "text-black"
              }`}
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              {user.name}
            </span>

            <Badge
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
              onClick={() => {
                readNotifications();
                setShowNotifications(true);
              }}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                icon={
                  isDarkMode ? (
                    <i className="ri-notification-2-line"></i>
                  ) : (
                    <i className="ri-notification-3-line"></i>
                  )
                }
                style={{ backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff" }}
              />
            </Badge>

            <i
              className={`ml-7 cursor-pointer ${
                isDarkMode
                  ? "ri-logout-circle-r-line text-white"
                  : "ri-logout-circle-r-fill"
              }`}
              onClick={() => {
                // Clear dark mode class from document body
                document.body.classList.remove("dark");

                // Clear dark mode preference from localStorage
                localStorage.removeItem("theme");

                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* body */}
        <div className="p-5">
          {children}

          {
            <Notifications
              notifications={notifications}
              reloadNotifications={getNotifications}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
            />
          }
        </div>
      </div>
    )
  );
}

export default ProtectedPage;
