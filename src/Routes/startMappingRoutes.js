import { Router } from "express";
const router = Router();
import {startMapping,saveMappingData,getListMaps,} from "../Controllers/startMappingController.js";

router.post("/start-mapping", startMapping);
router.post("/save-mapping-data", saveMappingData);

router.get("/get-list-maps", getListMaps);

export default router;
