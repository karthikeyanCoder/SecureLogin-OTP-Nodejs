import { Router } from 'express';
const adminRouter = Router();
import {createUser,getAllUsers} from "../Controllers/adminController.js"
adminRouter.post("/register/:role",createUser)
adminRouter.get("/get-user", getAllUsers);
export default adminRouter