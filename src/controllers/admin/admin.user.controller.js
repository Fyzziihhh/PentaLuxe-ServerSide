import User from "../../models/user.models.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({isVerified:true}).populate('addresses')
     .select("username email status phone addresses")
     .sort({ createdAt: -1 });
  console.log("usersInAdminCOnt", users);
  if (!users || users.length < 1) {
    cre
    return res.status(404).json({
      success: false,
      message: "No Users Founded",
    });
  }

  return res.status(200).json({
    success: true,
    message: "All Users Fetched Successfully",
    users,
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  console.log("insdie UpdateUser");
  const { id, status } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status: status === "ACTIVE" ? "BLOCKED" : "ACTIVE" },
      { new: true }
    );
    console.log("updatedUser", updatedUser);

    if (!updatedUser) {
      console.log("klsjdf");
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User status updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



const searchUsers = async (req, res) => {
  console.log('Inside the admin user search')
  const { text } = req.body;
  console.log(text)

  if (!text) {
    return res.status(400).json({
      message: "No text provided.",
      success: false,
    });
  }

  try {
    const users = await User.find({ username: new RegExp(text, "i") }).populate('addresses')
    .select("username email status phone addresses");
    console.log(users)

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users found.",
       users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export { 
  getAllUser,
   updateUserStatus, 
   searchUsers
  };
