import { Router } from "express";
import { saveMappingData ,getManualMapping, getAutomaticMapping, getAutomaticDisinfectMapping} from "../Controllers/autoMatic.js"

const router = Router();
router.post("/start-mapping", saveMappingData);
 

//get mode api
router.get("/get-manual-mapping",getManualMapping)
router.get("/get-automatic-mapping",getAutomaticMapping) 
router.get("/get-automatic-disinfect-mapping",getAutomaticDisinfectMapping)
export default router;
