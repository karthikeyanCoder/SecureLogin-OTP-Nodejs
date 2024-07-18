import { Router } from 'express';
const router = Router();
import { validateUser, verifyOtp, createPassword, login, forgotPasswordOtpVerify, forgotPasswordOtpSend, forgetResetPassword } from '../Controllers/authController.js';

router.post('/validate-user', validateUser);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', createPassword);
router.post('/login', login);

//forget password 
router.post('/forget-password', forgotPasswordOtpSend);
router.post('/password-otp-verify', forgotPasswordOtpVerify);
router.post("/forget-reset-password",forgetResetPassword);
export default router;
