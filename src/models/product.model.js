import mongoose from "mongoose";



const productSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    Images: [
      {
        type: String,
        required: true,
      },
    ],
    Description: {
      type: String,
      required: true,
    },
    Variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
    Gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },
    ScentType: {
      type: String,
      required: true,
    },
    DiscountPercentage: {
      type: Number,
      requied: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
