import { Router } from 'express';
const adminRouter = Router();
import {createUser} from "../Controllers/adminController.js"
adminRouter.post("/register",createUser)

export default adminRouter