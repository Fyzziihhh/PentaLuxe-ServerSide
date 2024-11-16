import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../../helpers/cloudinary.js";
import Category from "../../models/category.model.js";
import User from "../../models/user.models.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import {
  createResponse,
  serverErrorResponse,
} from "../../helpers/responseHandler.js";
const adminLogin = (req, res) => {
  console.log("inside the adminController");
  const { email, password } = req.body;
  if (email.trim() === "") {
    return res
      .status(404)
      .json({ success: false, message: "Email is required" });
  }
  if (password.trim() === "") {
    return res
      .status(404)
      .json({ success: false, message: "Password is required" });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email }, process.env.ADMIN_TOKEN_SECRET, {
      expiresIn: process.env.ADMIN_TOKEN_EXPIRY,
    });
    console.log("admin Token", token);
    return res.status(200).json({
      success: true,
      message: "Admin LoggedIn Successfully",
      token,
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
    serverErrorResponse(res);
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

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const EditCategory = async (req, res) => {
  const { categoryName,categoryId } = req.body;
  console.log("req.body", req.body);
  console.log(req.file);
  if (categoryName.trim() === "") {
    return createResponse(res, 400, false, "Category Name is Required");
  }
  try {
    const existCategory=await Category.findOne({categoryName})
    if(existCategory) return createResponse(res,409,false,"Category Already Exist With The Given Name")
    const category = await Category.findById(categoryId);
   
  if (!category) {
    return createResponse(res, 404, false, "No Category Founded");
  }

  if (req.file) {
    const response = await uploadOnCloudinary(req.file);
    console.log("inside edit categoryEdit Upload", response);
    category.categoryName = categoryName;
    category.categoryImage = response[0];
    await category.save();
    console.log(category)
    return createResponse(
      res,
      200,
      true,
      "Category Updated Successfully",
      category
    );
  }
  console.log('lsjldk')
  category.categoryName = categoryName;
  await category.save();
  return createResponse(
    res,
    200,
    true,
    "Category Updated Successfully",
    category
  );
  } catch (error) {
    console.log(error)
    serverErrorResponse(res)
  }
};

export {
  adminLogin,
  uploadFilesAndAddCategory,
  getCategories,
  deleteCategory,
  EditCategory,
};
