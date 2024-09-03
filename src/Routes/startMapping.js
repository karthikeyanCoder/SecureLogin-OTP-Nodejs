import { Router } from "express";
import { saveMappingData } from   "../Controllers/autoController.js"

const router = Router();
router.post("/start-mappings", saveMappingData);
 
export default router;
