import Product from "../../models/product.model.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { createResponse } from "../../helpers/responseHandler.js";
const productDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return createResponse(res, 404, false, "Product ID is required");

  const product = await Product.findById(id).populate("Variants");
  if (!product)
    return createResponse(
      res,
      404,
      false,
      "No product exists for the provided ID"
    );

  return createResponse(
    res,
    200,
    true,
    "Product details fetched successfully",
    product
  );
});

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("Variants").populate('CategoryId').sort({createdAt:-1});
  
    const filterdProductsByCategory=products.filter(product=>product.CategoryId!==null)
    console.log('filteredProducts : ',filterdProductsByCategory)
    return createResponse(
      res,
      200,
      true,
      "Products fetched successfully based on user preference.",
      filterdProductsByCategory
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return createResponse(res, 500, false, "Error fetching products.");
  }
};

export { productDetails, getProducts };
