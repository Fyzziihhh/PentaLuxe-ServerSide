import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponName: {
      type: String,
      required: true,
      uppercase:true
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    maxDiscountPrice: {
      type: Number,
      required: true,
    },
    minimumPurchasePrice: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
