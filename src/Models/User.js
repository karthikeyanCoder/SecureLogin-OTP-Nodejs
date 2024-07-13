import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String,unique:true },
    otp: { type: String },
    isFirstTime: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
