
import {
  createResponse,
  serverErrorResponse,
} from "../../helpers/responseHandler.js";
import Offer from "../../models/offer.model.js";
import Product from "../../models/product.model.js";

const processProductOffer = async (req, res) => {
  const { DiscountPercentage, itemId } = req.body;

  console.log(req.body);

  try {
    const offer=await Offer.create({
      DiscountPercentage,
      offerType:"Product",
      offerFor:itemId

    })
    console.log("offer",offer)
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
    const offer=await Offer.create({
      DiscountPercentage,
      offerType:"Category",
      offerFor:itemId

    })
    console.log("categoryOffer",offer)

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

const ListOffers=async(req,res)=>{
  const offers=await Offer.find().populate('offerFor').sort({createdAt:-1})
  console.log(offers)

  return createResponse(res,200,true,"Offers retrieved Successfully",offers)


}

export { processProductOffer, processCategoryOffer ,ListOffers};
