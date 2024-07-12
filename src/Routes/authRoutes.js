import express from 'express';
import { signup, verifyOtp, createPassword, login, forgotPassword, resetPassword } from "../Controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/otp-verify", verifyOtp);
router.post("/create-password", createPassword);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
