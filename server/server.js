const express=require('express');
const cors = require('cors');

require('dotenv').config(); // Ensure this is called to load environment variables from the .env file
const app=express(); //initializing app variable
const corsOptions = {
    origin: ['http://localhost:3000', 'https://mercato-846n.onrender.com/'], // Allow both local and live origins
    credentials:true,   
    optionsSuccessStatus: 200
  };
app.use(cors(corsOptions)); //// Use cors middleware with options
app.use(express.json()); //to take the request body from frontend
require('dotenv').config(); //to use dotenv variables 
const dbConfig=require('./config/dbConfig');
//need a port ot runn a backend application
const port= process.env.PORT || 5000; //dont ue 3000 as ther client code is running
//create a route
const usersRoute= require('./routes/userroutes');
const productsRoute= require('./routes/productsRoute');
const bidsRoute=require('./routes/bidsRoute');
const notificationsRoute = require('./routes/notificationsRoute');

//now we need end point middleware
app.use('/api/users', usersRoute); //end point which is having this key word /api/users will be navigated to usersRoute and there it will check the exact end point(login and registerations and based on logic it will send the response whether succes or error to the cleint
app.use('/api/products', productsRoute);
app.use('/api/bids', bidsRoute);
app.use('/api/notifications', notificationsRoute);

// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

//need to start the server
const server=app.listen(port, '0.0.0.0', ()=> console.log(`Node.js server started on port ${port}`));



    
