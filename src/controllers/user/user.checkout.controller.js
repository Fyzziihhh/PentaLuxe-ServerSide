import Address from "../../models/address.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.models.js";
import { Variant } from "../../models/varient.model.js";
import Cart from "../../models/cart.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createResponse } from "../../helpers/responseHandler.js";
// const processOrderSubmission = async (req, res) => {
//   const { addressId, paymentMethod, totalAmount, items, productImage } =
//     req.body;

//   if (
//     !addressId ||
//     !paymentMethod ||
//     totalAmount <= 0 ||
//     !items ||
//     items.length === 0
//   ) {
//     return res.status(400).json({ message: "Invalid order submission" });
//   }
//   try {
//     const shippingAddress = await Address.findById(addressId);
//     if (!shippingAddress) {
//       return res.status(404).json({ message: "Address not found" });
//     }
//     const stockUpdates = [];
// let product
//     for (const item of items) {
//        product = await Product.findById(item.productId).populate(
//         "Variants"
//       );

//       const variant = product.Variants.find(
//         (varient) => varient.price === item.price
//       );
//       if (variant.stock < item.quantity) {
//         return res
//           .status(400)
//           .json({ message: `Insufficient stock for ${product.Name} variant` });
//       }
//       variant.stock -= item.quantity;
//       await Variant.findByIdAndUpdate(variant._id, { stock: variant.stock });
//     }

//     const estimatedDeliveryDays = 5;
//     const estimatedDeliveryDate = new Date();
//     estimatedDeliveryDate.setDate(
//       estimatedDeliveryDate.getDate() + estimatedDeliveryDays
//     );
//     let orderId = "#";
//     for (let i = 0; i < 6; i++) {
//       orderId += Math.floor(Math.random() * 10);
//     }
//     const order = await Order.create({
//       _id: orderId,
//       user: req.user.id,
//       shippingAddress,
//       totalAmount,
//       paymentMethod,
//       items,
//       status: "Confirmed",
//       orderDate: new Date(),
//       estimatedDeliveryDate,
//       productImage,
//     });

//     const cart = await Cart.findOne({ user: req.user._id });

//     if (cart) {
//       cart.products = [];
//       await cart.save();
//     }

//     return res.status(201).json({
//       message: "Order submitted successfully",
//       orderId: order._id,
//       estimatedDeliveryDate,
//     });
//   } catch (error) {
//     console.error("Error processing order submission:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const createRazorpayOrder = async (req, res) => {
  try {
    const razorPayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.totalPrice * 100,
      currency: "INR",
    };

    const order = await razorPayInstance.orders.create(options);

    return createResponse(res, 200, true, "Order created successfully", order);
  } catch (error) {
    console.log("paymentError", error);
    return createResponse(res, 401, false, "Failed to create payment");
  }
};

const paymentVerification = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderDetails,
  } = req.body;

  // Create the body string for signature verification
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  // Generate the expected signature using HMAC
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  // Verify the signature
  const isAuthentic = expectedSignature === razorpay_signature;

  try {
    if (isAuthentic) {
      const order = await createOrder(req.user.id, orderDetails);
      return createResponse(res, 201, true, "Order created successfully", {
        orderId: order._id,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
      });
    } else {
      return createResponse(res, 400, false, "Payment verification failed.");
    }
  } catch (error) {
    return createResponse(res, 500, false, "Server error during order creation");
  }
};

const placeOrder = async (req, res) => {
  console.log("lksjlfjlksjlkfjlksjklfjklsjfkljslkjfkl"
  )
  try {
    
    const order = await createOrder(req.user.id, req.body);
    console.log("Order",order)
    return createResponse(res, 201, true, "Order created successfully", {
      orderId: order._id,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
    });
  } catch (error) {
    console.log("order Erroro",error)
    return createResponse(res, 500, false, "Error creating order");
  }
};

const createOrder = async (userId, orderDetails) => {
  const { addressId, items, paymentMethod, totalAmount } = orderDetails;

  const estimatedDeliveryDate = new Date();
  const shippingAddress = await Address.findById(addressId).select('-_id -Phone -user -addressType -default');

  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);
  let orderId = "#";
  for (let i = 0; i < 6; i++) {
    orderId += Math.floor(Math.random() * 10);
  }

  const order = await Order.create({
    _id: orderId,
    user: userId,
    shippingAddress,
    items,
    totalAmount,
    paymentMethod,
    status: paymentMethod === "Razorpay" ? "Confirmed" : "Pending",
    orderDate: new Date(),
    estimatedDeliveryDate,
  });

  for (const item of items) {
    const product = await Product.findById(item.productId).populate("Variants");

    const variant = product.Variants.find(
      (variant) => variant.price === item.price
    );

    if (!variant) {
      throw new Error(`Variant not found for ${product.Name}`);
    }

    if (variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.Name} variant`);
    }

    variant.stock -= item.quantity;
    await Variant.findByIdAndUpdate(variant._id, { stock: variant.stock });
  }

  await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [] } });

  return order;
};

export { placeOrder, createRazorpayOrder, paymentVerification };
