import express from "express";
import passport from "passport";
import {
  logOutUser,
  registerUser,
  resendOtp,
  VerifyOtp,
  logInUser,
  googleAuth
} from "../../controllers/user/user.controllers.js"
import verifyToken from "../../middlewares/verifyToken.middlerware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/otp-verify", VerifyOtp);
router.post("/resend-otp", resendOtp);
// router.post('/refresh-token',)
router.post("/logout", verifyToken, logOutUser);
router.post("/login", logInUser);
router.post('/google-auth',googleAuth)

export default router;
