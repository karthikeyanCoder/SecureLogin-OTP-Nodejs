import { Router } from 'express';
const router = Router();
import {checkAndUpdateVersion ,getUserVersion} from "../Controllers/updateVersion.js"

router.post('/meta-data', checkAndUpdateVersion );
router.get("/get-meta-data",getUserVersion)
export default router;