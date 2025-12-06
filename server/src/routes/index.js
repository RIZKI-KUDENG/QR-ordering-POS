import express from 'express';
import authRouter from './auth.js';
import tableRouter from './table.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/table', tableRouter);

export default router;