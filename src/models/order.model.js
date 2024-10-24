import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Shipped",
        "Confirmed",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    shippingAddress: {
      Name: { type: String, required: true },
      FlatNumberOrBuildingName: { type: String, required: true },
      Locality: { type: String, required: true },
      Landmark: { type: String, required: false },
      District: { type: String, required: true },
      State: { type: String, required: true },
      Pincode: { type: String, required: true },
      
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  
    totalAmount: {
      type: Number,
      required: true,
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          productName: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
          },
          discountPercentage: {
            type: Number,
            default: 0,
          },
          subtotal: {
            type: Number,
            required: true,
          },
          productImage: {
            type: String,
          },
        },
      ],
      required: true, 
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
