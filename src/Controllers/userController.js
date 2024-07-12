import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import User from "../Models/userModels.js";
import Otp from "../Models/otpModel.js";
import { sendOtpEmail } from "../config/email.js";

export const signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const OTP = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    console.log("Generated OTP :", OTP);
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(OTP, salt);

    const newOtp = new Otp({ email: req.body.email, otp: hashedOTP });
    await newOtp.save();
    await sendOtpEmail(req.body.email, OTP);
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("signup error:", error.message);
    return res.status(500).json({ message: "Failed to sign up", error:error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpEntry = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpEntry) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, otpEntry.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("verify OTP error:", error);
    return res.status(500).json({ message: "Failed to verify OTP", error:error.message });
  }
};

export const createPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1day",
    });

    res.status(200).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("create password error:", error.message);
    res.status(500).json({ message: "Failed to create password", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1day",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("login error:", error.message);
    res.status(500).json({ message: "Failed to log in", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const OTP = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    console.log("Generated OTP :", OTP);
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(OTP, salt);

    const newOtp = new Otp({ email, otp: hashedOTP });
    await newOtp.save();
    await sendOtpEmail(email, OTP);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("forgot password error:", error.message);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpEntry = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpEntry) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, otpEntry.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email }, { password: hashedPassword });
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("reset password error:", error.message);
    res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
};
