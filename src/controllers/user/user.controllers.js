import userModel from "../../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import passport from "passport";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendOTPEmail } from "../../utils/EmailOTPSender.js";
import { generateOtp } from "../../utils/GenerateOtp.js";
import { generateAccesTokenAndRefreshToken } from "../../utils/GenerateTokens.js";

// @desc Register a new user
// @route POST /api/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;

  // Check if user already exists
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return res.status(409).json({ message: "User Already Exists" });
  }

  // Generate OTP
  const otp = generateOtp(4);
  console.log("Generated OTP:", otp);

  // Send OTP via email
  try {
    await sendOTPEmail(email, otp);
    console.log("OTP sent to:", email);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP email." });
  }

  const user = await userModel.create({
    username,
    email,
    password,
    otp,
    phone,
    otpExpiryTime: Date.now() + 5 * 60 * 1000,
  });

  console.log("user", user);

  const createdUser = await userModel
    .findById(user._id)
    .select("-password -otp -refreshToken");
  res.status(201).json({
    success: true,
    message: "User created successfully. Please verify your OTP.",
    user: createdUser,
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
      return res.status(400).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    if (Date.now() > user.otpExpiryTime) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has Expired" });
    }

    // Check if the OTP matches
    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      console.log("OTP verification successful.");

      //generating accessToken and RefreshToken
      const { accessToken, refreshToken } =
        await generateAccesTokenAndRefreshToken(user._id);
      return res.status(200).json({
        success: true,
        message: "OTP verification successfully completed.",
        accessToken,
        refreshToken,
      });
    } else {
      console.log("Invalid OTP provided.");
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification.",
    });
  }
});

// @desc resend otp
// @route POST /api/user/resend-otp
// @access Public

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const otp = generateOtp(4);
  user.otp = otp;
  user.otpExpiryTime = Date.now() + 5 * 60 * 1000;

  await user.save();
  console.log("User OTP:", user.otp);

  try {
    await sendOTPEmail(email, otp);
    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP email",
    });
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  console.log("inside logout");
  const user = await userModel.findByIdAndUpdate(
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

  res.json({ success: true, message: "User LogOut Successfully" });
});

const logInUser = asyncHandler(async (req, res) => {
  console.log("hkd");
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Email Or Password" });
  }
  if (!user.isVerified)
    return res.status(401).json({
      success: false,
      message: "Please verify your email to activate your account",
    });

  const isMatch = user.isPasswordCorrect(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Email Or Password" });
  }

  const { accessToken, refreshToken } = await generateAccesTokenAndRefreshToken(
    user._id
  );

  user.refreshToken = refreshToken;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "user logged In Successfully",
    accessToken,
    refreshToken,
  });
});

const googleAuth = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const userExist = await userModel.findOne({ email });

  if (userExist) {
    console.log(userExist);
    return res.status(200).json({
      success: true,
      message: "User Logged In Successfully ",
    });
  }

  const user = await userModel.create({
    username,
    email,
    isVerified: true,
  });
  console.log("googleAuthUser:", user);

  if (user) {
    const { accessToken, refreshToken } =
      await generateAccesTokenAndRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: "User Signed Up Successfully",
      user,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(500).json({ success: false, message: "Failed to create user" });
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
