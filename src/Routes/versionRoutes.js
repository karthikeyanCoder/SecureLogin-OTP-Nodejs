import { Router } from 'express';
const router = Router();
import {checkAndUpdateVersion } from "../Controllers/updateVersion.js"

router.post('/meta-data', checkAndUpdateVersion );

export default router;