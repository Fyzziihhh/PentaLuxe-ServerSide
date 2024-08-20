import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler'
import  userModel from '../models/user.models.js'

const verifyToken =  asyncHandler(async (req,res,next) => {
    let token = req.cookies.access_token
    if(token){
        try {
            
            const decode = jwt.verify(token,process.env.ACCESS_TOKEN_SCERET)
            req.user = await userModel.findById({_id:decode._id})
            next()
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized,invalid Token");
        }

    } else {
        res.status(401);
        throw new Error("Not Authorized,No Token");
    }
})