// Function to Generate Access and Refresh Tokens
 import userModel from "../models/user.models.js";
export const generateAccesTokenAndRefreshToken = async (userId) => {
    try {
      const user = await userModel.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(
        "Something went wrong while generating refresh and access tokens"
      );
    }
  };