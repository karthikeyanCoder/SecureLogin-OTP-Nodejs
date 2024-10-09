import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "please provide valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    role:{type:String,enum:['user','admin'],default:'user'},
    otp: { type: String },
    forgotPasswordOtp: { type: String },
    isFirstTime: { type: Boolean, default: true },
    isOtpVerified: { type: Boolean, default: false },
    currentVersion: { type: String, default: "1.0" },
    lastUpdateNotification: { type: Date },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
