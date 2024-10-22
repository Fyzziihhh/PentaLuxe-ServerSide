import jwt from 'jsonwebtoken';
import { asyncHandler } from '../helpers/asyncHandler.js';
import User from '../models/user.models.js';

const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(' ')[1];
        console.log(token)
        

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, No Token Provided" });
        }

        try {
            
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            const user = await User.findById(decoded._id);

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
