import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import productModel from "../../models/product.models.js";
import categoryModel from "../../models/category.model.js";

const uploadFilesAndAddProducts = asyncHandler(async (req, res) => {
  try {
    console.log("Received request to upload files and add product");

    // Extracting product details from the request body
    const {
      productName,
      categoryName,
      productScentType,
      productDescription,
      gender,
      productStockQuantity,
      productDiscountPrice,
      productVolumes, // This should be an object initially
    } = req.body;

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // Upload files to Cloudinary
    const response = await uploadOnCloudinary(req.files);
    if (!response || response.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed" });
    }

    // Find the category
    const Category = await categoryModel.findOne({ categoryName });
    if (!Category) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found" });
    }

    // Convert productVolumes object to Map
    const volumesMap = new Map(Object.entries(productVolumes));
    console.log(volumesMap);

    // Create a new product
    const Product = await productModel.create({
      productName,
      productDescription,
      productStockQuantity,
      gender,
      isBlocked: false,
      productScentType,
      productImages: response,
      productDiscountPrice,
      productVolumes: volumesMap, // Pass the converted Map here
      CategoryId: Category._id,
    });

    // Return success response
    res
      .status(201)
      .json({
        success: true,
        message: "Product added successfully",
        product: Product,
      });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate('CategoryId').sort({ createdAt: -1 });

    console.log("products:",products)
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
       products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the id is present
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "Product ID is required",
    });
  }

  // Attempt to find and delete the product
  const deletedProduct = await productModel.findByIdAndDelete(id);

  if (!deletedProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    deletedProduct,
  });
});


const singleProudct=asyncHandler(async(req,res)=>{
      const {id}=req.params
      if(!id){
        return res.status(404).json({
          success:false,
          message:"Product ID is Not provided"
        })
      }
      const product =await productModel.findById({_id:id}).populate('CategoryId')
      if(!product){
        return res.status(404).json({
          success:false,
          message:"No Product is Founded With Provided Id"
        })

      }

      console.log(product)
      return res.status(200).json({
        success:true,
        message:"Product fetched Successfully",
        product
      })

})


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; 
    const updates = req.body; 
    console.log(updates,id)

  
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    if (!updates) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updates,
      { new: true } 
    );
console.log('updatedPrud',updatedProduct)
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
  return   res.status(200).json({
    success:true,
    message:"Product Updated Successfully"
  });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

   



export { uploadFilesAndAddProducts ,getAllProducts,deleteProduct,singleProudct,updateProduct};
