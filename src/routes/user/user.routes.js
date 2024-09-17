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
import { getAllProducts } from "../../controllers/admin/admin.product.controller.js";
import { productDetails } from "../../controllers/user/user.product.controller.js";
import { getCategories } from "../../controllers/admin/admin.controller.js";
import { getAllProductsByCategory } from "../../controllers/user/user.category.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/otp-verify", VerifyOtp);
router.post("/resend-otp", resendOtp);
// router.post('/refresh-token',)
router.post("/logout", verifyToken, logOutUser);
router.post("/login", logInUser);
router.post('/google-auth',googleAuth)


router.get('/products',getAllProducts)
router.get('/products/:id',productDetails)

router.get('/categories',getCategories)
router.get('/categories/:id',getAllProductsByCategory)

export default router;
