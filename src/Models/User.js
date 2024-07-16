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
      minlength: [8, "Password cannot be shorter than 8 characters."],
    },
    otp: { type: String },
    forgotPasswordOtp: { type: String },
    isFirstTime: { type: Boolean, default: true },
    isOtpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
