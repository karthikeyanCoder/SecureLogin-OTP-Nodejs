import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (recipient, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: recipient,
      subject: "Your OTP for verification",
      html: `<h1>Hello,</h1> <p>Your OTP code is <b>${otp}</b>. This code will expire in 2 minutes.</p>
       <p>Best regards,
       <br/> Your team</p>`,
    });
    return { success: true, message: "OTP   sent To Email successfully" };
   
  } catch (error) {
    return { success: false, message: "Error sending OTP email.", error: error.message };
    
  }
};

export default transporter;
