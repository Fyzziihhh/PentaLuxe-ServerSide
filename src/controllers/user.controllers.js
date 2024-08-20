import userModel from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOTPEmail } from "../utils/EmailOTPSender.js";

// Utility Function to Generate OTP
const generateOtp = (length = 4) => {
  let otp = "";
  const digits = "1234567890";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

// Function to Generate Access and Refresh Tokens
const generateAccesTokenAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefrshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while generating refresh and access tokens");
  }
};

// @desc Register a new user
// @route POST /api/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return res.status(401).json({ message: "User Already Exists" });
  }

  // Generate OTP
  const otp = generateOtp(4);
  console.log("Generated OTP:", otp);

  // Send OTP via email
  try {
    await sendOTPEmail(email, otp);
    console.log("OTP sent to:", email);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ success: false, message: "Failed to send OTP email." });
  }

  // Create the new user
  console.log("hkfhgffhjg");
  
  

  const user= await userModel.create({
    username,
    email,
   password,
     otp,
    status: "PENDING",
  });
  
  console.log("user",user.otp)
  

  const createdUser = await userModel.findById(user._id).select("-password -otp -refreshToken");
  res.status(201).json({
    success: true,
    message: "User created successfully. Please verify your OTP.",
    data: createdUser,
  });
});


// @desc verify Otp
// @route POST /api/user/otp-verify
// @access Public

const VerifyOtp = asyncHandler(async (req, res) => {
  console.log("Entering the OTP route");

  const { otp, email } = req.body;
  console.log(`Received OTP: ${otp}, Email: ${email}`);

  try {
      // Find the user by email
      const user = await userModel.findOne({ email });
       //Check if user not Found
      if (!user) {
          console.log("No account found with this email address.");
          return res.status(400).json({
              success: false,
              message: "No account found with this email address."
          });
      }

      // Check if the OTP matches
      if (user.otp === otp) {
          user.status = "VERIFIED";
          user.otp=null;
          await user.save();
          console.log("OTP verification successful.");
           
          //generating accessToken and RefreshToken
          const {accessToken,refreshToken}=generateAccesTokenAndRefreshToken(user._id)

          const options={
            httpOnly:true,
            secure:true,
            sameSite:'Strict'
          }
                 res.cookie("access_token",accessToken,options)
                 res.cookie("refresh_token",refreshToken,options)
          return res.status(200).json({
              success: true,
              message: "OTP verification successfully completed."
          });
      } else {
          console.log("Invalid OTP provided.");
          return res.status(400).json({
              success: false,
              message: "Invalid OTP. Please try again."
          });
      }
  } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
          success: false,
          message: "An error occurred during OTP verification."
      });
  }
});



export
 {
   registerUser,
  VerifyOtp
 };