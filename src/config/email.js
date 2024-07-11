import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const { EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_REFRESH_TOKEN, EMAIL_USER, SERVER_URL } = process.env;

const oAuth2Client = new google.auth.OAuth2(
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  `${SERVER_URL}/auth/google/callback`
);
oAuth2Client.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });

export const sendOtpEmail = async (email, otp) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: EMAIL_CLIENT_ID,
        clientSecret: EMAIL_CLIENT_SECRET,
        refreshToken: EMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <p>Hello,</p>
        <p>Your OTP code is <b>${otp}</b>. This code will expire in 5 minutes.</p>
        <p>Best regards,<br/> Your team</p>
      `,
    };

    const result = await transport.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};
