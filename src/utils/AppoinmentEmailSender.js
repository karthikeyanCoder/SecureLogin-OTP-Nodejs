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
export const bookingEmail = async (recipient, sessionDates) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: recipient,
      subject: "Booking Confirmation",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <h1 style="color: #4CAF50;">Booking Confirmation</h1>
        <p style="font-size: 16px;">Dear Valued Customer,</p>
        <p style="font-size: 16px;">Your session has been successfully booked for the following dates:</p>
        <ul style="list-style-type: none; padding: 0;">
           <li style="padding: 8px; background: #f9f9f9; border-radius: 4px; margin: 4px 0;">${sessionDates}.</li>
        </ul>
        <p style="font-size: 16px;">Thank you for choosing us! If you have any questions, feel free to reach out.</p>
        <p style="font-size: 16px;">Best regards,<br/>Your Team</p>
      </div>
    `,
  });
    console.log("Booking email sent successfully");
  } catch (error) {
    console.error("Error sending booking email:", error);
    throw error;
  }
};

export default transporter;
