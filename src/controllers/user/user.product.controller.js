import Product from "../../models/product.model.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { createResponse, serverErrorResponse } from "../../helpers/responseHandler.js";
import Category from "../../models/category.model.js";

const productDetails = asyncHandler(async (req, res) => {

  const { id } = req.params;
  if (!id) return createResponse(res, 404, false, "Product ID is required");

  const product = await Product.findById(id).populate("Variants").populate('CategoryId');
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
    const products = await Product.find()
      .populate("Variants")
      .populate("CategoryId")
      .sort({ createdAt: -1 });

    const filterdProductsByCategory = products.filter(
      (product) => product.CategoryId !== null
    );
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

const searchProductsByCategory = async (req, res) => {
  const { text } = req.body;
  console.log(text);

  if (!text) {
    return createResponse(res, 400, false, "No Text provided");
  }

  try {
    const products = await Product.find({}).populate("CategoryId");
    const regex = new RegExp(text, "i"); // 'i' is for case-insensitive search
    const searchedProducts = products.filter((product) =>
      product.Name.match(regex)
    );

    if (!searchedProducts || searchedProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products found.",
      searchedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const getRelatedProducts=async(req,res)=>{
  console.log("inside related products")
  try {
    const categoryName=req.query.category
      const category=await Category.findOne({categoryName})
      if(!category){
        return createResponse(res,404,false,"Category Not Found")
      
      }
      const relatedProducts = await Product.find({ CategoryId:category._id }).limit(3);
      return createResponse(res,200,true,"related product fetched Successfully",relatedProducts)
  } catch (error) {
    serverErrorResponse(res)
  }

}

export { productDetails, getProducts, searchProductsByCategory ,getRelatedProducts};
