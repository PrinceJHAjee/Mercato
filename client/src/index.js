import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { message } from "antd";
import {Provider} from "react-redux"
import store from "./redux/store";



// Configure the message component to consume the context from ConfigProvider
message.config({
  top: 100, // Example configuration, you can adjust this as needed
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
    <Provider store={store}>
      <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#2D94CC",
            colorPrimaryHover: "#4096FF",
            borderRadius: "2px",
          },
        },
        token: {
          borderRadius: "2px",
        },
      }}
    >
      <App/>
    </ConfigProvider>
    </Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
