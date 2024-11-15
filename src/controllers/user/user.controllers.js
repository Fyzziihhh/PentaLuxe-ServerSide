import User from "../../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import passport from "passport";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { sendOTPEmail } from "../../helpers/EmailOTPSender.js";
import { generateOtp } from "../../utils/GenerateOtp.js";
import { generateAccesTokenAndRefreshToken } from "../../helpers/GenerateTokens.js";
import { createResponse } from "../../helpers/responseHandler.js";

// @desc Register a new user
// @route POST /api/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;

  // Check if user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return createResponse(res, 409, false, "User Already Exists");
  }

  // Generate OTP
  const otp = generateOtp(4);
  console.log("Generated OTP:", otp);

  // Send OTP via email
  try {
    await sendOTPEmail(email, otp);
    console.log("OTP sent to:", email);
  } catch (error) {
    return createResponse(res, 500, false, "Failed to send OTP email.");
  }

  const user = await User.create({
    username,
    email,
    password,
    otp,
    phone,
    otpExpiryTime: Date.now() + 5 * 60 * 1000,
  });

  console.log("user", user);

  const createdUser = await User.findById(user._id).select(
    "-password -otp -refreshToken"
  );

  return createResponse(res, 201, true, "User created successfully. Please verify your OTP.", createdUser);
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
    const user = await User.findOne({ email });
    // Check if user not found
    if (!user) {
      return createResponse(res, 400, false, "No account found with this email address.");
    }

    if (Date.now() > user.otpExpiryTime) {
      return createResponse(res, 400, false, "OTP has expired.");
    }

    // Check if the OTP matches
    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      console.log("OTP verification successful.");

      // Generating accessToken and refreshToken
      const { accessToken, refreshToken } = await generateAccesTokenAndRefreshToken(user._id);
      return createResponse(res, 200, true, "OTP verification successfully completed.", { accessToken, refreshToken });
    } else {
      console.log("Invalid OTP provided.");
      return createResponse(res, 400, false, "Invalid OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return createResponse(res, 500, false, "An error occurred during OTP verification.");
  }
});


// @desc resend otp
// @route POST /api/user/resend-otp
// @access Public

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return createResponse(res, 404, false, "User not found");
  }
  
  const otp = generateOtp(4);
  user.otp = otp;
  user.otpExpiryTime = Date.now() + 5 * 60 * 1000;

  await user.save();
  console.log("User OTP:", user.otp);

  try {
    await sendOTPEmail(email, otp);
    return createResponse(res, 200, true, `OTP sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return createResponse(res, 500, false, "Failed to send OTP email");
  }
});


const logOutUser = asyncHandler(async (req, res) => {
  console.log("inside logout");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

 return createResponse(res,200,true,"User Logout Successfully")
});

const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if(email.trim()==='' || password.trim()===''){
    return createResponse(res,401,false,"Email and Password are required")
  }

  const user = await User.findOne({ email });
  if (!user) {
    return createResponse(res, 404, false, "Invalid Email Or Password");
  }
  
  if (!user.isVerified) {
    return createResponse(res, 401, false, "Please verify your email to activate your account");
  }

  const isMatch = user.isPasswordCorrect(password);
  if (!isMatch) {
    return createResponse(res, 401, false, "Invalid Email Or Password");
  }

  const { accessToken, refreshToken } = await generateAccesTokenAndRefreshToken(user._id);
  
  user.refreshToken = refreshToken;
  await user.save();
console.log("inside the login")
  return createResponse(res, 200, true, "User logged in successfully", {
    accessToken,
    refreshToken,
  });
});


const googleAuth = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    try {
      const { accessToken, refreshToken } =
        await generateAccesTokenAndRefreshToken(userExist._id);
      return createResponse(res, 200, true, "User Logged In Successfully", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.log("error", error);
      return createResponse(res, 500, false, "Failed to generate tokens");
    }
  }

  const user = await User.create({
    username,
    email,
    isVerified: true,
  });
  console.log("googleAuthUser:", user);

  if (user) {
    const { accessToken, refreshToken } =
      await generateAccesTokenAndRefreshToken(user._id);
    console.log("tokenACC", accessToken);
    return createResponse(res, 201, true, "User Signed Up Successfully", {
      user,
      accessToken,
      refreshToken,
    });
  } else {
    return createResponse(res, 500, false, "Failed to create user");
  }
});


export {
  registerUser,
  VerifyOtp,
  resendOtp,
  logOutUser,
  logInUser,
  googleAuth,
};
