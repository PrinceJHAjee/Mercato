//global pages only the logged in users can access
import React from "react";
import { useEffect, useCallback, useState  } from "react";
import { Avatar, Badge, message } from "antd";
import { GetCurrentUser, RefreshToken } from "../apicalls/Users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/lodersSlice";
import { SetUser } from "../redux/usersSlice";
import Notifications from "./Notifications";
import { GetAllNotifications, ReadAllNotifications } from "../apicalls/notifications";

function ProtectedPage({ children }) {
  const [notifications = [], setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useSelector((state) => state.users.user);
  // const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const validateToken = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      console.log("GetCurrentUser response:", response); // Log the response
      if (response.success) {
        console.log("Setting user:", response.data); // Log user data
        // setUser(response.data);
        //dispatching the user data to the redux store
         dispatch(SetUser(response.data));
      }

      // else {
      //   navigate("/login");
      //   message.error(response.message);
      // }
      //following line from chatgpt to add logic to refresh the token if it expires:
      else {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const newTokenResponse = await RefreshToken(refreshToken);
          console.log("RefreshToken response:", newTokenResponse); // Log the response
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
      // by gpt:Update the validateToken function to handle expired tokens properly, clear the expired token from localStorage, and redirect to the login page.
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

  return(
     user && (
      <div> 
        {/* header */}
        <div className="flex justify-between items-center bg-primary p-5">
          <h1 className="text-white text-2xl cursor-pointer"
          onClick={()=>navigate("/")}>Mercato</h1>
          <div className="bg-white py-2 px-5 rounded flex gap-2 items-center">
          {/* <i className="ri-user-fill"></i> */}
            <span className=" cursor-pointer uppercase"
            onClick={() => {
              if(user.role==='user'){
                navigate("/profile");
              }else{
                navigate("/admin");
              }

            }
              
            }>
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
                icon={<i className="ri-notification-3-line"></i>}
              />
            </Badge>


            <i className="ri-logout-circle-r-fill ml-7 cursor-pointer" 
            onClick={()=>{
              localStorage.removeItem("token");
              navigate("/login");
            }}></i>

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
