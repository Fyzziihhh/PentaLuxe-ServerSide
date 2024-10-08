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
    },
    password: {
      type: String,
    },
    addresses: [
      {
        type: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default:false
    },
    phone: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["ACTIVE","BLOCKED"],
      default: "ACTIVE",
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiryTime: {
      type: Date
    },
    Product:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Product"
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
    process.env.ACCESS_TOKEN_SECRET,
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
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
