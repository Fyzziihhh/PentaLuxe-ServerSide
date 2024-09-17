import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productImages: [
      {
        type: String,
        required: true,
      },
    ],
    productDescription: {
      type: String,
      required: true,
    },
    productStockQuantity: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },
    productScentType: {
      type: String,
      required: true,
    },
    productDiscountPrice: {
      type: Number,
      requied: true,
    },
    productVolumes: {
      type: Map,
      of: String,
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

const productModel = mongoose.model("Product", productSchema);

export default productModel;
