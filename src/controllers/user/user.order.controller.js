import Address from "../../models/address.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.models.js";
import { Variant } from "../../models/varient.model.js";
import Cart from "../../models/cart.model.js";
import { createResponse } from "../../helpers/responseHandler.js";

const getUserOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find({ user: req.user._id }).populate("shippingAddress").sort({createdAt:-1});
    console.log(orders);

    return createResponse(res, 200, true, "Orders fetched successfully",  orders );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return createResponse(res, 500, false, "Server Error");
  }
};


const cancelOrder = async (req, res) => {
  const { id } = req.body;

  try {
    // Validate order ID
    if (!id) {
      return createResponse(res, 400, false, "Order ID is required.");
    }

    // Find the order by ID
    const order = await Order.findById(id);
    console.log(order, id);

    // Check if the order exists
    if (!order) {
      return createResponse(res, 404, false, "Order not found.");
    }

    // Check if the order can be canceled based on its status
    const cancellableStatuses = ["Pending", "Confirmed"];
    if (!cancellableStatuses.includes(order.status)) {
      return createResponse(res, 400, false, "Order cannot be canceled at this stage.");
    }

    // Update order status to Cancelled
    order.status = "Cancelled";
    await order.save();

    return createResponse(res, 200, true, "Order canceled successfully.", order);
  } catch (error) {
    console.error("Error canceling order:", error);
    return createResponse(res, 500, false, "Server error. Please try again later.");
  }
};


export {  getUserOrders, cancelOrder };
