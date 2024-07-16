import { Router } from 'express';
const router = Router();
import { initailLogin, verifyOtp, resetPassword, login, forgotPasswordOtpVerify, forgotPasswordOtpSend, forgetResetPassword } from '../Controllers/authController.js';

router.post('/first-login', initailLogin);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/login', login);

//forget password 
router.post('/forget-password', forgotPasswordOtpSend);
router.post('/password-otp-verify', forgotPasswordOtpVerify);
router.post("/forget-reset-password",forgetResetPassword)
export default router;
