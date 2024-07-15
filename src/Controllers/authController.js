import User from "../Models/User.js";
import { sendOtpEmail } from "../utils/email.js";
import { randomBytes } from "crypto";
import { hash, compare } from "bcrypt";
import { generateToken } from "../utils/jwt.js";

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
      return res.json({ message: "OTP sent to your Email account", isFirstTime: true });
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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // if (user.isFirstTime) {
    //   return res.status(400).json({ message: "First-time login requires." });
    // }

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    console.log(`OTP for user : ${email}: otps is : ${otp}`);
    user.otp = null;
    user.isOtpVerified =true;
    await user.save();

    return res.json({ message: "OTP verified, proceed to reset password" });
  } catch (error) {
    return res.status(500).json({ error: error.message, error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    console.log("Reset password request:", email, password, confirmPassword);

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Both password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isOtpVerified) {
      return res
        .status(400)
        .json({
          message:
            "First time OTP verification is required before resetting the password",
        });
    }
    user.password = await hash(password, 10);
    user.isFirstTime = false;
    await user.save();
    const token = generateToken(user);
    return res.json({ message: "Password reset successful", token });
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
    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: error.message });
  }
};



 
