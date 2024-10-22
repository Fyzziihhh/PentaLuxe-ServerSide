import mongoose from "mongoose";

const addressSchema = mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    Name: { type: String, required: true },
    FlatNumberOrBuildingName: { type: String, required: true },
    Locality: { type: String, required: true },
    Landmark: { type: String, required: false },
    District: { type: String, required: true },
    State: { type: String, required: true },
    Pincode: { type: String, required: true },
    Phone: { type: String, required: true },
    addressType: { type: String,required: true,},
    default:{type:Boolean}
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", addressSchema);
