import { Router } from "express";
import { saveMappingData } from   "../Controllers/autoController.js"

const router = Router();
router.post("/start-mapping", saveMappingData);
 
export default router;
