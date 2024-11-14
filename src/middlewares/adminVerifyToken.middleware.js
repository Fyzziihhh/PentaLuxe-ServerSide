import jwt from "jsonwebtoken";
import { serverErrorResponse } from "../helpers/responseHandler.js";

const adminVerifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-admin-authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied, admins only" });
    }

    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({
              success: false,
              message: "Admin Token expired,Please Try Again",
            });
        } else {
          return res
            .status(401)
            .json({
              success: false,
              message: "Access denied: authentication failed",
            });
        }
      }
      next();
    });
  } catch (error) {
   serverErrorResponse(res)
  }
};

export default adminVerifyToken;
