import { Router } from "express";
const router = Router();
import {startMapping,saveMappingData,getListMaps, getMapNames} from "../Controllers/startMappingController.js";

router.post("/start-mapping", startMapping);
router.post("/save-mapping-data", saveMappingData);

router.get("/get-list-maps", getListMaps);
router.get("/get-map-name", getMapNames)
export default router;
