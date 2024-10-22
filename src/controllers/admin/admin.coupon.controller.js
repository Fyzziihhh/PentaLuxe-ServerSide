import Coupon from "../../models/coupon.model.js";
import { createResponse, serverErrorResponse } from "../../helpers/responseHandler.js";

const createCoupon = async (req, res) => {
    console.log(req.body)
  try {
    const { couponData:{
      couponName,
      discountPercentage,
      maxDiscountPrice,
      minimumPurchasePrice,
      expiryDate,}
    } = req.body;
    console.log(couponName,discountPercentage,maxDiscountPrice)

    if (
      !couponName ||
      !discountPercentage ||
      !maxDiscountPrice ||
      !minimumPurchasePrice ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingCoupon = await Coupon.findOne({ couponName });
    if (existingCoupon) {
        return createResponse(res,409,false,"Coupon with this name already exists.")
    }

    const newCoupon = await Coupon.create({
      couponName,
      discountPercentage,
      maxDiscountPrice,
      minimumPurchasePrice,
      expiryDate,
    });
    console.log(newCoupon)
 return createResponse(res,201,true,"Coupon created successfully.",newCoupon)
   
  } catch (error) {
    console.error(error.message);
   return serverErrorResponse(res)
  }
};

const editCoupon = async (req, res) => {};

const deleteCoupon = async (req, res) => {
    const id=req.params.id
   
    try {
        const coupon=await Coupon.findByIdAndDelete(id)
        if(!coupon){
            return createResponse(res,404,false,"No Coupon is Founded with The Provided Id")
        }
        return createResponse(res,200,true,"Coupon Removed Successfully")
    } catch (error) {
        serverErrorResponse(res)
    }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
 return createResponse(res,200,true,"Coupons retrieved successfully.",coupons)
    

  } catch (error) {
    serverErrorResponse(res,"Failed to fetch coupon codes")
  }
};

export { createCoupon, deleteCoupon, editCoupon, getAllCoupons };
