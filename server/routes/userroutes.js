  //to write any end point
//   const express = require('express');
  const router=require("express").Router();
  //to perform the operation
    const User=require("../models/userModel");
    const bcrypt = require("bcryptjs"); //for hashing the passsword
    const jwt = require("jsonwebtoken"); //for generating token because in login we have to send  tokens to the client then clien the token with othe req and we can compare authorization is done or not
    
const authMiddlewares = require("../middlewares/authMiddlewares");


    //start writing apis--------------
    //new user registration
    router.post('/register',async (req, res)=>{
        // always use try catch here generally
        try{
            
            //1. check if user already exist
            
            const user=await User.findOne({email: req.body.email});
            if(user){
               
                return res.status(400).send({
                  success: false,
                  message: 'User already exists',
                });
            }

                //2. hashing the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password=hashedPassword;

                //3.Create or save new user
                const newUser = new User(req.body);
                await newUser.save();
                res.send({
                    success:true,
                    message:'User registered successfully'
                });
            
        }catch(error){
            
           res.status(500).send({
            
              success:false,
                message:error.message

           })
        } 
    })

    //user login
    router.post("/login", async (req, res)=>{
        try {
            
            //1. check if user exist
           
            const user = await User.findOne({email: req.body.email});
            if(!user){
                throw new Error('User not found');
            }

            //if user is active or not
            if(user.status !== 'active'){
                throw new Error('User account is blocked, please contact the admin');
            }
            //2. if come out of if st means user exist then check if password is correct by comapring plain password(req.body.password) with hashed passed stored in db (user.password)
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword){
                throw new Error('Password is incorrect');
            }
            //3. if user and password is correct then send token to user
            const token = jwt.sign({UserId: user._id}, process.env.jwt_secret, {expiresIn: "24h"});
            //3. if come out of if st means password is correct then generate token and send it
            res.send({
                success:true,
                message:'User logged in successfully',
                //send data as token
                data: token

                
            })

            
        } catch (error) {
            
            res.status(500).send({
                success:false,
                message:error.message
            });
            
        }
    })

    //get current user
    //protected end point
router.get("/get-current-user", authMiddlewares , async (req, res) => {
    try {
       
      const user= await User.findById(req.body.userId);
      if (!user) {
        return res.send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
        res.send({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
      
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

  //To handle token expiration seamlessly, you can implement a refresh token mechanism. This involves issuing a long-lived refresh token that can be used to get a new access token when the current one expires.

// Step 3.1: Create a Refresh Token Endpoint (CHATGPT)
// Add a new endpoint to issue a new token using a refresh token.
const refreshTokenSecret = process.env.refresh_token_secret;

router.post("/refresh-token", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }

        const userData = jwt.verify(refreshToken, refreshTokenSecret);
        const newToken = jwt.sign({ UserId: userData.UserId }, process.env.jwt_secret, { expiresIn: "7d" });
       // for the Issue a refresh token along with the access token during login.
        res.send({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                refreshToken
            }
        });
    } catch (error) {
        res.status(401).send({
            success: false,
            message: "Invalid refresh token",
            error: error.message
        });
    }
});

  
  
//get all users including admin as well
router.get("/get-users", authMiddlewares, async (req, res) => {
    try {
      const users = await User.find();
      res.send({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
    }
    );

//update user status
router.put("/update-user-status/:id", authMiddlewares, async (req, res) => {
    try {
      await User.findByIdAndUpdate
      (req.params.id, req.body);
      res.send({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
        }
    }
    );


    //export both
    module.exports=router;