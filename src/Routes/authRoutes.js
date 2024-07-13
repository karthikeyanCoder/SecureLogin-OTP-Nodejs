import { Router } from 'express';
const router = Router();
import { initailLogin, verifyOtp, resetPassword, login } from '../Controllers/authController.js';

router.post('/first-login', initailLogin);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/login', login);

export default router;
