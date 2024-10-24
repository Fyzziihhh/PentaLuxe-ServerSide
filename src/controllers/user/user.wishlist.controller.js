import jwt from "jsonwebtoken";
import {
  createResponse,
  serverErrorResponse,
} from "../../helpers/responseHandler.js";
import { Variant } from "../../models/variant.model.js";
import Wishlist from "../../models/wishlist.model.js";

const AddToWishlist = async (req, res) => {
  const { productId, variant } = req.body;
  console.log(productId, variant);
  const userId = req.user._id;

  const selectedVarient = await Variant.findOne({ volume: variant });
  if (!selectedVarient) {
    return createResponse(res, 404, false, "Selected Variant is Not Found");
  }

  const wishlist = await Wishlist.findOne({ user: userId });
  console.log("existing Wishlist", wishlist);
  if (!wishlist) {
    const WishlistData = {
      user: userId,
      products: [
        {
          product: productId,
          variant: selectedVarient._id,
        },
      ],
    };

    const createdWishlist = await Wishlist.create(WishlistData);
    console.log(createdWishlist);
    return createResponse(
      res,
      201,
      true,
      "Product Added to Wishlist",
      createdWishlist
    );
  }

  const existingProduct = await wishlist.products.find(
    (product) => product.product._id.toString() === productId
  );
  console.log("existing Product", existingProduct);
  if (existingProduct) {
    return createResponse(res, 409, false, "Product Already In the Wishlist");
  }
  wishlist.products.push({
    product: productId,
    variant: selectedVarient._id,
  });
  await wishlist.save();

  console.log("updatedWishlist", wishlist);

  return createResponse(res, 201, true, "Product Added to Wishlist");
};

const removeFromWishlist = async (req, res) => {
  const { id } = req.params;
  console.log("productId", id);
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return createResponse(res, 404, false, "Wishlist not found");
    }

    const updatedProducts = wishlist.products.filter(
      (item) => item.product.toString() !== id
    );

    wishlist.products = updatedProducts;
    await wishlist.save();

    console.log("updatedWishlist", wishlist);

    return createResponse(
      res,
      200,
      true,
      "Product removed from wishlist",
      wishlist
    );
  } catch (error) {
    console.error(error);
    return serverErrorResponse(res);
  }
};

const fetchWishlistProducts = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded._id;

      const userWishlist = await Wishlist.findOne({ user: userId })
        .populate({
          path: "products.product",
          populate: {
            path: "Variants",
          },
        })
        .populate("products.variant")
        .select("products -_id");
      console.log("userWallet", userWishlist.variant);
      if (userWishlist) {
        return res.status(200).json({
          success: true,
          message: "Wishlist retrieved successfully",
          data: userWishlist.products,
        });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Wishlist is empty", data: [] });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
  }

  return res
    .status(200)
    .json({ success: true, message: "Wishlist is empty", data: [] });
};

const checkProductInWishlist = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;



  try {
    const wishlist = await Wishlist.findOne({user:userId });
    console.log(wishlist)
    if (!wishlist) {
      return createResponse(res, 200, false, "Wishlist not found");
    }
    const isInWishlist = wishlist.products.find(product=>product.product._id.toString()===id)

    return createResponse(res, 200, isInWishlist?true:false);
  } catch (error) {
    serverErrorResponse(res);
  }
};
export {
  AddToWishlist,
  removeFromWishlist,
  fetchWishlistProducts,
  checkProductInWishlist,
};
