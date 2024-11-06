import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import Coupon from "../../models/coupon.model.js";
import jwt from "jsonwebtoken";
import { createResponse } from "../../helpers/responseHandler.js";
const addToCart = async (req, res) => {
  const { productId, volume } = req.body;
  const user = req.user;

  try {
    const product = await Product.findById(productId)
      .populate("Variants")
      .populate("CategoryId");
    console.log("addtocart", product);
    if (!product) {
      return createResponse(res, 404, false, "Product Not Found");
    }

    const selectedVariant = product.Variants.find(
      (variant) => variant.volume === volume
    );

    if (!selectedVariant) {
      return createResponse(res, 400, false, "Invalid product volume selected");
    }
    if (selectedVariant.stock === 0) {
      return createResponse(
        res,
        400,
        false,
        "Sorry, this item is currently unavailable"
      );
    }

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        products: [
          { product: productId, quantity: 1, variant: selectedVariant._id },
        ],
      });
      console.log(cart);
      return createResponse(
        res,
        200,
        true,
        "Product Added to the cart Successfully",
        cart.products[0]
      );
    }

    const existingProduct = cart.products.find(
      (product) =>
        product.product.toString() === productId &&
        product.variant.toString() === selectedVariant._id.toString()
    );

    if (existingProduct) {
      return createResponse(res, 409, false, "Product Already in the Cart");
    }

    cart.products.push({
      product: productId,
      quantity: 1,
      variant: selectedVariant._id,
    });
    await cart.save();

    return createResponse(
      res,
      200,
      true,
      "Product Added to the cart Successfully",
      cart.products[cart.products.length - 1]
    );
  } catch (error) {
    console.error(error);
    return createResponse(
      res,
      500,
      false,
      "An error occurred while adding the product"
    );
  }
};

const getUserCart = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded._id;

      const userCart = await Cart.findOne({ user: userId })
        .populate({
          path: "products.product",
          populate: {
            path: "CategoryId",
            select: "categoryName",
          },
        })
        .populate("products.variant")
        .select("products -_id");

      if (userCart) {
        return createResponse(
          res,
          200,
          true,
          "Cart retrieved successfully",
          userCart.products
        );
      } else {
        return createResponse(res, 200, true, "Cart is empty", []);
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return createResponse(res, 401, false, "Invalid or expired token");
    }
  }

  return createResponse(res, 200, true, "Cart is empty", []);
};

const changeProductQuantity = async (req, res) => {
  const { itemId, action, stock } = req.body;

  if (!itemId) {
    return createResponse(res, 400, false, "Item ID is Required");
  }

  const userId = req.user._id;

  try {
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      return createResponse(res, 404, false, "Cart Not Found");
    }

    const product = userCart.products.find(
      (product) => product._id.toString() === itemId
    );

    if (!product) {
      return createResponse(res, 404, false, "Item not found in cart");
    }

    switch (action) {
      case "INC":
        if (product.quantity < 10) {
          if (product.quantity >= stock) {
            return createResponse(res, 400, false, "Stock limit reached");
          } else {
            product.quantity += 1;
          }
        } else {
          return createResponse(
            res,
            400,
            false,
            "Limit of 10 items per person reached"
          );
        }
        break;

      case "DEC":
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          userCart.products = userCart.products.filter(
            (prod) => prod._id !== itemId
          );
        }
        break;

      default:
        return createResponse(res, 400, false, "Invalid action");
    }

    await userCart.save();

    return createResponse(res, 200, true, "Product quantity updated", userCart);
  } catch (error) {
    console.error("Error updating product quantity:", error);
    return createResponse(res, 500, false, "Server error");
  }
};

const removeProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!id) {
    return createResponse(res, 400, false, "Product ID is Required");
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return createResponse(res, 404, false, "Cart not found");
    }

    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === id
    );

    if (productIndex === -1) {
      return createResponse(res, 404, false, "Product not found in cart");
    }

    cart.products.splice(productIndex, 1);
    await cart.save();
    return createResponse(res, 200, true, "Product removed from cart");
  } catch (err) {
    return createResponse(res, 500, false, "Error removing product from cart", {
      error: err.message,
    });
  }
};

const updateCartTotalPrice = async (req, res) => {
  const { totalPrice } = req.body;
  const userId = req.user.id;

  if (!totalPrice) {
    return createResponse(res, 400, false, "Total price is required");
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return createResponse(res, 404, false, "Cart not found");
    }

    cart.totalPrice = totalPrice;
    await cart.save();
    return createResponse(res, 200, true, "Total Price Updated Successfully");
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "An error occurred while updating the total price"
    );
  }
};

const getAllAvailableCoupons = async (req, res) => {
  console.log("inside the coupons");
  try {
    const coupons = await Coupon.find({});

    const AvailableCoupons = coupons.filter(coupon=>Date.now()>coupon.expiryDate)

    console.log(updatedCoupons);

    return createResponse(
      res,
      200,
      true,
      "Coupons retrieved successfully.",
      AvailableCoupons
    );
  } catch (error) {
    console.log(error);
    serverErrorResponse(res, "Failed to fetch coupon codes");
  }
};

export {
  addToCart,
  getUserCart,
  changeProductQuantity,
  removeProduct,
  updateCartTotalPrice,
  getAllAvailableCoupons,
};
