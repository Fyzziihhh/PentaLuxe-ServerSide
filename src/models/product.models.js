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
    productImages:[ {
      //   imageId: {
      //     type: String,
      //     required: true,
      //   },
      //   url: {
      //     type: String,
      //     required: true,
      //   },
      // },
      type: String,
      required: true
    }],
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
      enum: ["Male", "Female", "Unisex"],
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
      to: Number,
    },
    isBlocked: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema)

export default productModel