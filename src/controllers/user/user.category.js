

import productModel from "../../models/product.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";



const getAllProductsByCategory=asyncHandler(async(req,res)=>{
    console.log('hsk')
                const {id}=req.params
                const products=await productModel.find({CategoryId:id})
                console.log("categoryProd",products)
                if(products.length === 0){
                    res.status(404).json({
                        success:false,
                        message:"No Products found in this category"
                    })
                }

                return res.status(200).json({
                    success:true,
                    message:"All Products are fetched based on the Category",
                    products
                })
                

})
export {getAllProductsByCategory}