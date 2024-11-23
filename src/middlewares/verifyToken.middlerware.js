import jwt from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler.js";
import User from "../models/user.models.js";
import { createResponse } from "../helpers/responseHandler.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return createResponse(
        res,
        401,
        false,
        "Not Authorized, Please Log In"
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decoded._id);

      if (!user) {
        return createResponse(
          res,
          401,
          false,
          "Not Authorized, User Not Found"
        );
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("Token Verification Error:", error);
      return createResponse(
        res,
        401,
        false,
        "Not Authorized, Token Verification Failed"
      );
    }
  } else {
    createResponse(res, 401, false, "Not Authorized, Please Logged In");
  }
});

export default verifyToken;
