import express from 'express';
import authRouter from './auth.js';
import tableRouter from './table.js';
import productRouter from './product.js';
import orderRouter from './order.js';
import paymentRouter from './payment.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/tables', tableRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/payment', paymentRouter);

export default router;