import express from "express";

import {
  logOutUser,
  registerUser,
  resendOtp,
  VerifyOtp,
  logInUser,
  googleAuth
} from "../../controllers/user/user.controllers.js"
import verifyToken from "../../middlewares/verifyToken.middlerware.js";
import { getProducts, productDetails } from "../../controllers/user/user.product.controller.js";
import { getCategories } from "../../controllers/admin/admin.controller.js";
import { getAllProductsByCategory } from "../../controllers/user/user.category.controller.js";
import { createAddress, DeleteAddress, getAllAddresses, getUserAddressById, getUserProfile, UpdateUserAddress, updateUserProfile } from "../../controllers/user/user.profile.controller.js";
import { addToCart, changeProductQuantity, getUserCart, removeProduct, updateCartTotalPrice } from "../../controllers/user/user.cart.controller.js";
import { cancelOrder, getUserOrders } from "../../controllers/user/user.order.controller.js";
import { userStatus } from "../../middlewares/userStatus.middleware.js";
import {  createRazorpayOrder, paymentVerification, placeOrder } from "../../controllers/user/user.checkout.controller.js";
import { getAllCoupons } from "../../controllers/admin/admin.coupon.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/otp-verify", VerifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/logout", verifyToken, logOutUser);
router.post("/login", logInUser);
router.post("/google-auth", googleAuth);

// User profile routes with userStatus middleware
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken,  updateUserProfile);

// Address book routes with userStatus middleware
router.post("/address-book", verifyToken,  createAddress);
router.get("/address-book", verifyToken, getAllAddresses);
router.get("/address-book/:id", verifyToken,  getUserAddressById);
router.put("/address-book", verifyToken,  UpdateUserAddress);
router.delete("/address-book/:id", verifyToken, DeleteAddress);

// Product routes
router.get("/products", getProducts);
router.get("/products/:id", productDetails);

// Category routes
router.get("/categories", getCategories);
router.get("/categories/:id", getAllProductsByCategory);

// Cart routes with userStatus middleware
router.get("/cart", verifyToken,  getUserCart);
router.post("/cart", verifyToken, addToCart);
router.delete("/cart/:id", verifyToken, removeProduct);
router.patch("/cart", verifyToken,  changeProductQuantity);
router.patch("/cart-total", verifyToken,  updateCartTotalPrice);

// Order routes with userStatus middleware
router.get("/orders", verifyToken, getUserOrders);
router.patch("/orders", verifyToken, cancelOrder);

router.post("/place-order", verifyToken,  placeOrder);

router.post('/create-razorpay-order',createRazorpayOrder)


router.post('/verify-payment-and-create-order',verifyToken,paymentVerification)
router.get('/getkey',async(req,res)=>res.status(200).json({key:process.env.RAZORPAY_API_KEY}))


router.get('/coupons',getAllCoupons)



export default router;
