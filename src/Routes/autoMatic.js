import express from 'express';
 
import { saveAutomatedDisinfectantData,getAutomatedDisinfectantData } from '../Controllers/autoMatic.js';

 
const router = express.Router();
 
router.post("/automated-disinfectant",   saveAutomatedDisinfectantData);

router.get("/get-automated-disinfectant",getAutomatedDisinfectantData)

export default router;
