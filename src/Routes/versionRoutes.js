import { Router } from 'express';
const router = Router();
import {checkForUpdate ,updateUserVersion} from "../Controllers/updateVersion.js"

router.post('/check-update', checkForUpdate );

router.post('/update-version', updateUserVersion);
export default router;