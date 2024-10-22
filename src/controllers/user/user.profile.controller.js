import Address from "../../models/address.model.js";
import User from "../../models/user.models.js";
import { createResponse } from "../../helpers/responseHandler.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";


const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  return createResponse(res, 200, true, "User profile retrieved successfully.", {
    email: user.email,
    username: user.username,
    phone: user.phone || null,
  });
});


const updateUserProfile = asyncHandler(async (req, res) => {
  const { email, phone, username } = req.body.user;

  const user = req.user;

  user.email = email;
  user.phone = phone;
  user.username = username;

  await user.save();

  return res
    .status(200)
    .json({ message: "Profile updated successfully", user });
});

//Address Management

const getAllAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("addresses");
     console.log(user.addresses)
    return createResponse(res, 200, true, "All addresses are received successfully", user.addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return createResponse(res, 500, false, "Server error while fetching addresses");
  }
};

const createAddress = asyncHandler(async (req, res) => {
  const formState = req.body.formState;
  const addressType = req.body.addressType;

  try {
    const addressData = {
      user: req.user._id,
      Name: formState.Name,
      FlatNumberOrBuildingName: formState.FlatNumberOrBuildingName,
      Locality: formState.Locality,
      Landmark: formState.Landmark,
      District: formState.District,
      State: formState.State,
      Pincode: formState.Pincode,
      Phone: formState.Phone,
      addressType,
    };

    const newAddress = await Address.create(addressData);

    if (!newAddress) {
      return createResponse(res, 404, false, "Failed to create new address");
    }

    const user = req.user;
    user.addresses.push(newAddress._id);
    await user.save();

    return createResponse(res, 201, true, "New address added successfully", newAddress);
  } catch (error) {
    console.log(error);
    return createResponse(res, 500, false, "Server error");
  }
});


const DeleteAddress = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    if (!id) {
      return createResponse(res, 404, false, "Address Id is required.");
    }

    // Remove the address ID from the user's addresses array
    user.addresses = user.addresses.filter(
      (addressId) => addressId.toString() !== id
    );

    await user.save();

    // Delete the address from the database
    await Address.findByIdAndDelete(id);

    return createResponse(res, 200, true, "Address deleted successfully.");
  } catch (error) {
    console.error("Error deleting address:", error);
    return createResponse(res, 500, false, "Server error.");
  }
};


const getUserAddressById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return createResponse(res, 400, false, "Address ID is required.");
  }

  try {
    const address = await Address.findById(id).select("-_id");
    
    if (!address) {
      return createResponse(res, 404, false, "Address not found.");
    }
    
    return createResponse(res, 200, true, "Address retrieved successfully with Id", address);
  } catch (error) {
    console.error("Error retrieving address:", error);
    return createResponse(res, 500, false, "Server error.");
  }
};


const UpdateUserAddress = async (req, res) => {
  console.log(req.body)
  const formState = req.body.formState;
  const userId = req.user._id;
  const addressType = req.body.addressType;
  const {  addressId } = req.body;
  console.log('addressId',addressId)

  try {
    const addressData = {
      user: userId,
      Name: formState.Name,
      FlatNumberOrBuildingName: formState.FlatNumberOrBuildingName,
      Locality: formState.Locality,
      Landmark: formState.Landmark,
      District: formState.District,
      State: formState.State,
      Pincode: formState.Pincode,
      Phone: formState.Phone,
      addressType,
    };

    const address = await Address.findById(addressId);
console.log(address)
    if (!address) {
      return createResponse(res, 404, false, "Address not found");
    }

    Object.assign(address, addressData);

    await address.save();

    return createResponse(res, 200, true, "Address updated successfully", address);
  } catch (error) {
    // Handle errors
    return createResponse(res, 500, false, "Error updating address", error);
  }
};


export {
  DeleteAddress,
  getUserProfile,
  updateUserProfile,
  createAddress,
  getAllAddresses,
  getUserAddressById,
  UpdateUserAddress,
};
