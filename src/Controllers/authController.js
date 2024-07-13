import User from "../Models/User.js";
import { sendOtpEmail } from "../utils/email.js";
import { randomBytes } from "crypto";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
export const initailLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isFirstTime) {
      const otp = randomBytes(3).toString("hex");
      user.otp = otp;
      await user.save();
      await sendOtpEmail(email, otp);
      return res.json({ message: "OTP sent", isFirstTime: true });
    } else {
      return res.json({ message: "Returning user ", isFirstTime: false });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;  
    await user.save();

    return res.json({ message: "OTP verified, proceed to reset password" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Reset password request:", email, password);

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await hash(password, 10);
    user.isFirstTime = false;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });
    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: error.message });
  }
};
