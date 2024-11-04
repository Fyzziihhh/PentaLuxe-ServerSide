import Address from "../../models/address.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import { Variant } from "../../models/variant.model.js";
import Cart from "../../models/cart.model.js";
import { createResponse } from "../../helpers/responseHandler.js";
import Wallet from "../../models/wallet.model.js";

const getUserOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find({ user: req.user._id })
      .populate("user")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
    return createResponse(
      res,
      200,
      true,
      "Orders fetched successfully",
      orders
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return createResponse(res, 500, false, "Server Error");
  }
};

const cancelOrReturnOrder = async (req, res) => {
  const { id, reason, type, payment } = req.body;
  console.log(payment);

  try {
    if (!id) {
      return createResponse(res, 400, false, "Order ID is required.");
    }

    if (!type || (type !== "cancel" && type !== "return")) {
      return createResponse(
        res,
        400,
        false,
        "Action type is required and must be either 'cancel' or 'return'."
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return createResponse(res, 404, false, "Order not found.");
    }

    if (type === "cancel") {
      const cancellableStatuses = ["Pending", "Confirmed"];

      if (!cancellableStatuses.includes(order.status)) {
        return createResponse(
          res,
          400,
          false,
          "Order cannot be canceled at this stage."
        );
      }
      if (payment === "Razorpay") {
        console.log("inside Wallet");
        const wallet = await Wallet.findOne({ userID: req.user._id });

        console.log("wallet", wallet);
        if (!wallet) {
          const newWallet = await Wallet.create({
            userID: req.user._id,
            balance: order.totalAmount,
            transactions: [
              {
                orderID: order._id,
                type: "credit",
                date: Date.now(),
                method: order.paymentMethod,
                amount: order.totalAmount,
              },
            ],
          });
          console.log("newWallet", newWallet);
        } else {
          wallet.balance += order.totalAmount;
          wallet.transactions.push({
            orderID: order._id,
            type: "credit",
            date: Date.now(),
            method: order.paymentMethod,
            amount: order.totalAmount,
          });

          await wallet.save();
        }
      }

      order.status = "Cancelled";
      order.cancellationReason = reason;
    } else if (type === "return") {
      // Handle return
      if (order.status !== "Delivered") {
        return createResponse(
          res,
          400,
          false,
          "Only delivered orders can be returned."
        );
      }
      if (payment === "Razorpay") {
        console.log("inside Wallet");
        const wallet = await Wallet.findOne({ userID: req.user._id });

        console.log("wallet", wallet);
        if (!wallet) {
          const newWallet = await Wallet.create({
            userID: req.user._id,
            balance: order.totalAmount,
            transactions: [
              {
                orderID: order._id,
                type: "credit",
                date: Date.now(),
                method: order.paymentMethod,
                amount: order.totalAmount,
              },
            ],
          });
          console.log("newWallet", newWallet);
        } else {
          wallet.balance += order.totalAmount;
          wallet.transactions.push({
            orderID: order._id,
            type: "credit",
            date: Date.now(),
            method: order.paymentMethod,
            amount: order.totalAmount,
          });

          await wallet.save();
        }
      }

      order.status = "Returned";
      order.returnReason = reason;
    }

    // Save the updated order
    await order.save();

    const message =
      type === "cancel"
        ? "Order canceled successfully."
        : "Order returned successfully.";
    return createResponse(res, 200, true, message, type);
  } catch (error) {
    console.error("Error processing order:", error);
    return createResponse(
      res,
      500,
      false,
      "Server error. Please try again later."
    );
  }
};

export { getUserOrders, cancelOrReturnOrder };
