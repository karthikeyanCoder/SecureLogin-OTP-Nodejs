import mongoose from "mongoose";
const { model } = mongoose;
const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please provide a valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide a valid password"],
      unique:true
    },
  },
  { timestamps: true }
);

const User = model("users", Schema);
export default User;
