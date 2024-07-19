import User from "../Models/User.js";
import { sendOtpEmail } from "../utils/email.js";
import { randomBytes } from "crypto";
import { hash, compare } from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { validatePassword } from "../utils/passwordValidator.js";
import { validateEmail } from "../utils/emailValidator.js";

export const validateUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isFirstTime) {
      const otp = randomBytes(3).toString("hex");
      user.otp = otp;
      await user.save();
      await sendOtpEmail(email, otp);
      return res.json({
        message: "OTP sent to your Email account",
        isFirstTime: true,
      });
    } else {
      //const token = generateToken(user);
      return res.json({
        message: "Returning user.you can Redirect to login page ",
        isFirstTime: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isFirstTime) {
      return res.status(400).json({ message: "your not from validate user ." });
    }

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    //console.log(`OTP for user : ${email}: otps is : ${otp}`);
    user.otp = null;
    user.isOtpVerified = true;
    await user.save();

    return res.json({
      message: "OTP verified, proceed to create your password",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, error });
  }
};

export const createPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!password) {
      return res.status(400).json({ message: "  password are required" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
       message: "Password must be at least 8 characters long and include at least one digit, one special character, one uppercase letter, and one lowercase letter."
      });
    }
    //console.log("create password request:", email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isOtpVerified) {
      return res.status(400).json({
        message: " OTP verification is required before resetting the password",
      });
    }

    user.password = await hash(password, 10);
    user.isFirstTime = false;
    await user.save();
    const token = generateToken(user);
    return res.json({ message: "Password Created successFully.", token });
  } catch (error) {
    console.error("Error creating password:", error);
    return res.status(500).json({ error: error.message, error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isFirstTime) {
      return res
        .status(400)
        .json({ message: "First-time login requires OTP verification." });
    }
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateToken(user);
    return res.json({ message: "Login SuccessFull. ", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: error.message, error });
  }
};

//forget password

export const forgotPasswordOtpSend = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = randomBytes(3).toString("hex");
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.forgotPasswordOtp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(email, otp);

    return res.json({
      message: "Forget password ,OTP sent to your email account",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, error });
  }
};

export const forgotPasswordOtpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.forgotPasswordOtp || user.forgotPasswordOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.forgotPasswordOtp = null;
    user.otpExpires = null;
    await user.save();

    return res.json({ message: "OTP verified, proceed to reset password" });
  } catch (error) {
    return res.status(500).json({ error: error.message, error });
  }
};

export const forgetResetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isFirstTime) {
      return res.status(400).json({
        message: "First-time users need to complete OTP verification first",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password validation failed. It should contain at least 8 characters, 1 number, and 1 special character.",
      });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    user.password = await hash(password, 10);

    user.isFirstTime = false;
    user.isOtpVerified = false;
    await user.save();

    const token = generateToken(user);

    return res.json({ message: "Password reset successful", token });
  } catch (error) {
    return res.status(500).json({ error: error.message, error });
  }
};
