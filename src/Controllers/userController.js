 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import User from  "../Models/models.js"
import Otp from "../Models/otpModel.js";
import {sendOtpEmail} from  "../config/email.js"
export const signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        console.log("Generated OTP:", OTP);
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(OTP, salt);

        const newOtp = new Otp({ email: req.body.email, otp: hashedOTP });
        await newOtp.save();
        await sendOtpEmail(req.body.email, OTP);
        return res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
        console.error("signup error:", error);
        res.status(500).json({ message: "Signup error", error });
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

        // Create new user
        const newUser = new User({ email });
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        // Delete OTP from database
        await Otp.deleteMany({ email });

        res.status(200).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("verify OTP error:", error);
        res.status(500).json({ message: "OTP verification error", error });
    }
};
