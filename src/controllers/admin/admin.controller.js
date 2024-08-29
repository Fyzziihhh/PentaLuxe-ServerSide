import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import categoryModel from "../../models/category.model.js";
import userModel from "../../models/user.models.js";
const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).json({
      success: true,
      adminToken: token,
      message: "Admin LoggedIn Successfully",
    });
  }

  return res
    .status(403)
    .json({ success: false, message: "Invalid Email or Password" });
};

const uploadFile = async (req, res) => {
  console.log("Inside the file upload function");
  console.log("req.file:", req.file); // Check what req.file contains
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const categoryName = req.body.categoryName;
  console.log("categoryName:", categoryName);
  const localFilePath = req.file.path;
  console.log(localFilePath);

  try {
    const response = await uploadOnCloudinary(localFilePath);
    console.log(response);
    const createdCategory = await categoryModel.create({
      categoryName,
      categoryImage: response.secure_url,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "File uploaded successfully",
        data: createdCategory,
      });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while uploading the file",
      });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (!categories || categories.length === 0)
      return res.status(404).json({
        success: false,
        message: "No categories found.",
      });
      return res.status(200).json({
        success: true,
        message: "Categories retrieved successfully.",
        categories
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Category ID is required" });
    }
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export { adminLogin, uploadFile, getCategories ,deleteCategory};
