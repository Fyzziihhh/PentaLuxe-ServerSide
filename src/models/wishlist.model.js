import mongoose, { mongo } from "mongoose";

const wishlistSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        required: true,
      },
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
