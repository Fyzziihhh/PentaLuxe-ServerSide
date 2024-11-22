import { serverErrorResponse } from "../helpers/responseHandler.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

 const userStatus = async (req, res, next) => {
   try {
     if (req.user) {
       if (req.user.status === "BLOCKED") {
         return res.status(401).json({ message: "Your account has been blocked" });
        }
        return next();
      }
    
      const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return next();
      }
      
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded._id);
      console.log("User inside the UserStatus Middleware",user)
      
      if (!user) {
      console.log(decoded)
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "BLOCKED") {
      return res.status(401).json({ message: "Your account has been blocked" });
    }
    next();
  } catch (err) {
    console.error(err); // Log the error for debugging
serverErrorResponse(res)
  }
};

export default userStatus