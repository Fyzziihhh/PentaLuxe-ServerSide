
import {
  createResponse,
  serverErrorResponse,
} from "../../helpers/responseHandler.js";
import Product from "../../models/product.model.js";

const processProductOffer = async (req, res) => {
  const { DiscountPercentage, itemId } = req.body;

  console.log(req.body);

  try {
    const product = await Product.findByIdAndUpdate(
      itemId,
      { DiscountPercentage },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Updated Product", product);
    return createResponse(
      res,
      200,
      true,
      `Successfully updated the discount to ${product.DiscountPercentage}% for product ${product.Name}.`
    );
  } catch (error) {
    console.log(error);
    serverErrorResponse(res);
  }
};

const processCategoryOffer = async (req, res) => {
  try {
    const { itemId } = req.body;
    const DiscountPercentage = Number(req.body.DiscountPercentage);

    const products = await Product.find({ CategoryId: itemId });

    if (products.length === 0) {
        createResponse(res,404,false,"No products found for the given category.")
    
    }

    await Promise.all(
      products.map(async (product) => {
        product.DiscountPercentage = DiscountPercentage;
        await product.save();
      })
    );

    return createResponse(
      res,
      200,
      true,
      "Discount percentage updated successfully for the category."
    );
  } catch (error) {
    serverErrorResponse(res);
  }
};

export { processProductOffer, processCategoryOffer };
