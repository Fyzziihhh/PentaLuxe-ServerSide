import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../../helpers/cloudinary.js";
import Category from "../../models/category.model.js";
import User from "../../models/user.models.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    req.session.email=email
    console.log(req.session)
  
    return res.status(200).json({
      success: true,
      message: "Admin LoggedIn Successfully",
    });
  }

  return res
    .status(403)
    .json({ success: false, message: "Invalid Email or Password" });
};

const uploadFilesAndAddCategory = async (req, res) => {
  console.log("Inside the file upload function");
  console.log("req.file:", req.file); // Check what req.file contains
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const categoryName = req.body.categoryName;
  const category = await Category.findOne({
    categoryName: { $regex: new RegExp(categoryName, "i") },
  });
  console.log("catedf", category);
  if (category) {
    return res.status(409).json({
      success: true,
      message: "Category Already Exists",
    });
  }

  try {
    const response = await uploadOnCloudinary(req.file);
    console.log(response);
    const createdCategory = await Category.create({
      categoryName,
      categoryImage: response[0],
    });
    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: createdCategory,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the file",
    });
  }
};

const getCategories = async (req, res) => {
  try {

    const categories = await Category.find().sort({ createdAt: -1 });
    if (!categories || categories.length === 0)
      return res.status(404).json({
        success: false,
        message: "No categories found.",
      });
    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Category deleted successfully",
        deletedCategory,
      });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const adminLogOut = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export { adminLogin, uploadFilesAndAddCategory, getCategories, deleteCategory,adminLogOut };
