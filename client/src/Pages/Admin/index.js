import React, { useEffect,useState } from 'react'
import { Tabs } from 'antd'
import Products from './Products'
import Users from './Users'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Admin({isDarkMode}) {

     
  const navigate=useNavigate();
 const {user}=useSelector(state=> state.users)
 useEffect(() => {
    if(user.role!=="admin"){
      navigate("/");
    }
 }, [])

 // Apply dark mode styles conditionally
const tableClassName = isDarkMode ? 'dark-table' : 'light-table';

 



  return (
    <div className="p-2 md:p-5">
      <Tabs
      className={tableClassName} //   Add this line to apply dark mode styles
      >
        <Tabs.TabPane tab="Products" key="1">
          <Products/>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="Users" key="2">
         <Users/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Admin
