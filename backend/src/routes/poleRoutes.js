import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listPoles } from '../controllers/poleController.js';
const router = Router();
router.get('/', auth(), listPoles);
export default router;
