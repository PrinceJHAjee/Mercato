import React from 'react'
import { useState, useEffect} from 'react'
import { Tabs } from 'antd'
import Products from './Products'
import UserBids from './UserBids'
import { useSelector } from 'react-redux';
import moment from 'moment';

function Profile() {
   // Define the isDarkMode state
   const [isDarkMode, setIsDarkMode] = useState(false);

    // Set the initial theme based on localStorage or other logic
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);
  const { user } = useSelector((state) => state.users);
  return (
    <div className={`p-5 ${isDarkMode ? "dark bg-[#1c1c1c] text-[#e0e0e0]" : "bg-white text-[#333]"}`}
    style={{
      minHeight: '100vh', // Ensure the container covers the full height of the viewport
    }}>
      <Tabs defaultActiveKey="1"
       className={isDarkMode ? "dark-tabs" : "light-tabs"} // Apply dark mode styles conditionally
       tabBarStyle={{
         backgroundColor: isDarkMode ? '#1c1c1c' : '#ffffff', // Ensure tab background color matches the theme
       }}
      >
        <Tabs.TabPane tab="Products" key="1">
         <Products/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Bids" key="2">
        <UserBids/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="General" key="3">
        <div className="flex flex-col md:w-1/3 p-2 md:p-0">
  <span  className={`text-xl flex justify-between ${isDarkMode ? "text-[#e0e0e0]" : "text-[#333]"}`}>
    Name: <span className="text-xl">{user.name}</span>
  </span>
  <span className={`text-xl flex justify-between ${isDarkMode ? "text-[#e0e0e0]" : "text-[#333]"}`}>
    Email: <span className="text-xl">{user.email}</span>
  </span>
  <span className={`text-xl flex justify-between ${isDarkMode ? "text-[#e0e0e0]" : "text-[#333]"}`}>
    Created At: {" "}
    <span className="text-xl">
      {moment(user.createdAt).format("MMM D , YYYY hh:mm A")}
    </span>
  </span>
</div>


        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Profile
