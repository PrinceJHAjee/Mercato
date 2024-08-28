import React from "react";
import { useEffect } from "react";
import {Button, Form, Input, message } from "antd";
import { Link} from "react-router-dom";
import Dividerr from "../../Components/Dividerr";
import { LoginUser } from "../../apicalls/Users";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/lodersSlice";


const rules=[
  {
    required:true,
    message:'required', 
  },
];

/*
To ensure the loader stays visible for a minimum duration and improve the user experience, you can introduce an artificial delay */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function Login() {
  const navigate = useNavigate()
  const dispatch= useDispatch();

  
  // Clear any existing token on login page load
  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
  }, []);

  const onFinish =async (values) => {
    try {
      dispatch(SetLoader(true));
      const startTime = Date.now();
      const response= await LoginUser(values);
      // to delay loader
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 1000; 
      if (elapsedTime < minimumLoadingTime) {
        await sleep(minimumLoadingTime - elapsedTime);
      } 
      dispatch(SetLoader(false));
      if(response.success){
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/"; // navigating the user to home page after login
      }else{
       throw new Error(response.message);
      }
      
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
      
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
          Mercato - <span className="text-gray-400 text-2xl">LOGIN</span>
          </h1>
         <Dividerr/> 
        <Form  layout="vertical"
           onFinish={onFinish}>
            
          <Form.Item label="Email" name='email' rules={rules}>
            <Input placeholder="Email" autoComplete="email"  />
          </Form.Item>
          <Form.Item label="Password" name='password' rules={rules}>
            <Input type="password" placeholder="Password" autoComplete="current-password"  />
          </Form.Item>

          {/* button */}
          
            <Button type="primary" htmlType="submit" className="w-full bg-primary text-white p-2 rounded mt-2">
              Login
            </Button>
         

          <div className="mt-5 text-center">
          <span className="text-gray-500">
            Don't have an account? <Link className="text-primary" to="/register">Register</Link> 
            
          </span>
          </div>

         
         
        </Form>
      </div>
    </div>
  );
}

export default Login;
