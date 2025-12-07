import express from 'express';
import authRouter from './auth.js';
import tableRouter from './table.js';
import productRouter from './product.js';
import orderRouter from './order.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/tables', tableRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);

export default router;