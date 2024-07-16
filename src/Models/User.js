import mongoose from "mongoose";

const Schema = mongoose.Schema;
const passwordValidator = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
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

      validate: {
        validator: function (v) {
          return passwordValidator.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid password. It should contain at least 8 characters, 1 number, and 1 special character.`,
      },
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
