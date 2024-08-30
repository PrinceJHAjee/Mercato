import React from "react";
import { useEffect } from "react";
import {Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Dividerr from "../../Components/Dividerr";
import { RegisterUser } from "../../apicalls/Users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/lodersSlice";



const rules=[
  {
    required:true,
    message:'required',
  },
];
//to delay the loader byy gpt
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function Register() {

  const navigate=useNavigate();
  const dispatch=useDispatch();

  
  // Clear any existing token on login page load
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     localStorage.removeItem("token");
  //   }
  // }, []);
   // Clear any existing token and dark mode on register page load
   useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    document.body.classList.remove("dark");
    localStorage.removeItem("theme");
  }, []);

  const onFinish = async (values) => {
    
    try {
      dispatch(SetLoader(true));
      const startTime = Date.now();// to delay the loader
      const response= await RegisterUser(values); //call function created in users.js for register front end api call format
      
      
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 1000; // Minimum loading time in milliseconds
      if (elapsedTime < minimumLoadingTime) {
        await sleep(minimumLoadingTime - elapsedTime);
      }
      dispatch(SetLoader(false));
     
      if(response.success){
        message.success(response.message)
        navigate("/login"); // Redirect to login after successful registration
      }else{
        message.error(response.message);
      }
      
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message)
    }
    
  };

  useEffect(() => {
   if(localStorage.getItem("token")){
      navigate("/"); 
   }
  }, []);

  
  
   

  return (
    <div className="h-screen bg-primary flex justify-center items-center p-2 md:p-0">
      <div className="bg-white p-5 rounded max-w-[450px]">

        <h1 className="text-primary text-2xl text-center">
          Mercato - <span className="text-gray-400 text-2xl">REGISTER</span>
          </h1>
         <Dividerr/> 
        <Form  layout="vertical"
           onFinish={onFinish}>
          <Form.Item label="Name" name='name' rules={rules}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name='email' rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name='password' rules={rules}>
            <Input type="password" placeholder="Password" />
          </Form.Item>

          {/* button */}
          
            <Button type="primary" htmlType="submit" className="w-full bg-primary text-white p-2 rounded mt-2">
              Register
            </Button>
         

          <div className="mt-5 text-center">
          <span className="text-gray-500">
            Already have an account? <Link className="text-primary" to="/login">Login</Link> 
            
          </span>
          </div>

         
         
        </Form>
      </div>
    </div>
  );
}

export default Register;
