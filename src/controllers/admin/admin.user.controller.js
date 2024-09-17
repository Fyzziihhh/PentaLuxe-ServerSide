import userModel from "../../models/user.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getAllUser=asyncHandler(async(req,res)=>{
      const users=await userModel.find().select("username email status phone addresses").sort({createdAt:-1})
      console.log("usersInAdminCOnt",users)
      if(!users|| users.length<1){
        return res.status(404).json({
            success:false,
            message:'No Users Founded'
        })
      }

      return res.status(200).json({
        success:true,
        message:"All Users Fetched Successfully",
        users

      })
})

const updateUserStatus=asyncHandler(async (req, res) => {
  console.log("insdie UpdateUser")
  const { id, status } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { status: status==="ACTIVE"?"BLOCKED":"ACTIVE" },
      { new: true } 
    );
    console.log("updatedUser",updatedUser)

    if (!updatedUser) {
      console.log("klsjdf")
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})



export {
  getAllUser,
  updateUserStatus
}