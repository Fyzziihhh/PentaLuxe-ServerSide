


import productModel from "../../models/product.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const productDetails=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!id) return res.status(404).json({
        success:false,
        message:"Product id is Required"
    })
    
    const product=await productModel.findById(id)
    console.log(product)
     if(!product) return res.status(404).json({
        success:false,
        message:"No product exists for the provided ID"
     })

     return res.status(200).json({
        success:true,
        message:"Product details fetched successfully",
        product
     })
    
    })




export {
    productDetails
}