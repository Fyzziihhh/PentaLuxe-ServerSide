

import Product from "../../models/product.model.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";

import { createResponse } from "../../helpers/responseHandler.js";

const getAllProductsByCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const products = await Product.find({ CategoryId: id }).populate('Variants');
  
    if (products.length === 0) {
      return createResponse(res, 404, false, "No Products found in this category");
    }
  
    return createResponse(res, 200, true, "All Products are fetched based on the Category", products);
  });
  
export {getAllProductsByCategory}