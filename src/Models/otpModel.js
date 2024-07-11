import mongoose from "mongoose";

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 
    }
}, { timestamps: true });

const OTP = mongoose.model("otp", otpSchema);

export default OTP;
