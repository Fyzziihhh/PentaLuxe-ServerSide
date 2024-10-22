import mongoose from "mongoose";
const variantSchema = mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      volume: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
    },
    { timestamps: true }
  );
  
  export const Variant = mongoose.model("Variant", variantSchema);
  