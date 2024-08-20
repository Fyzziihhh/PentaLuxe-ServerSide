
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: [{
      type:String
    }],
    isBlocked: {
      type: Boolean,
    },
    phone: {
      type: Number,
    },
    status: {
      type:String,
      enum: ["PENDING","VERIFIED", "BLOCKED"],
      default:"PENDING"
    },
    refreshToken:{
      type:String,
    },
    otp:{
      type:String,
    }
  },
  { timestamps: true }
);

//before Save The userSChema this Function will hash The Password and Store it in the Schema

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//This methods is used to check the given password is match with the existing password

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//access TOken Generator
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SCERET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//Refresh Token Generator

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SCERET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
