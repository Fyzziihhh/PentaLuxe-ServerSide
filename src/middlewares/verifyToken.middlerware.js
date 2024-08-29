import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import userModel from '../models/user.models.js';

const verifyToken = asyncHandler(async (req, res, next) => {
    console.log("helo")
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, No Token Provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            const user = await userModel.findById(decoded._id);

            if (!user) {
                return res.status(401).json({ success: false, message: "Not Authorized, User Not Found" });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Token Verification Error:", error);
            return res.status(401).json({ success: false, message: "Not Authorized, Token Verification Failed" });
        }
    } else {
        res.status(401).json({ success: false, message: "Not Authorized, No Token Provided" });
    }
});

export default verifyToken;
