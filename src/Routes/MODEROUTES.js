import { Router } from "express";
import { saveMappingData ,getMappingData} from "../Controllers/MODEAPI.js"
const router = Router();
//router.post("/v1/mode-mappings/start",saveMappingData)
router.post("/start-mappings", saveMappingData);
router.get("/mapping-data", getMappingData);

export default router;