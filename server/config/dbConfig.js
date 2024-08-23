const mongoose= require('mongoose');

//added when error comes , by gpt
require('dotenv').config(); // Ensure this line is present to load environment variables from the .env file

console.log('MONGO_URL:', process.env.mongo_url);
mongoose.connect(process.env.mongo_url);

//creating connection object
const connection = mongoose.connection;

//verify if connection is successful or not
connection.on('connected', ()=>{
    console.log('MongoDB connection is successful');
})
//for showing failed connection
connection.on('error', (err)=>{
    console.log('MongoDB connection is failed');

})

module.exports = connection;