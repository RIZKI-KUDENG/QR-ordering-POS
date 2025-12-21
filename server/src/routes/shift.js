import express from 'express';
import { startShift, endShift, getCurrentShift } from '../controllers/shiftControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);


router.post('/start', startShift);
router.post('/end', endShift);
router.get('/current', getCurrentShift);

export default router;