import express from 'express';
 
import {signup,verifyOtp} from "../Controllers/userController.js"
const router = express.Router();
 
router.post("/signup",signup);
router.post("/otp-verify",verifyOtp)
export default router;
