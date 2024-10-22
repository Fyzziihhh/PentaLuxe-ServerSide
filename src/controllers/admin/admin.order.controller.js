import Order from "../../models/order.model.js";

const getAllOrders = async (req, res) => {
  console.log("Fetching all orders...");
  try {
    const orders = await Order.find({})
      .populate("user")
      .populate("shippingAddress");
    console.log(orders);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const changeOrderStatus = async (req, res) => {
  const { status, orderId } = req.body;

  try {

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();


    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
   
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getAllOrders,changeOrderStatus };
