import express from 'express';
import { createOrder, getOrders, updateOrders, getOrderById } from '../controllers/orderControllers.js';
import { verifyKitchen, authMiddleware } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();
orderRouter.post('/', createOrder);
orderRouter.get('/:id', getOrderById);
// orderRouter.use(authMiddleware);
// orderRouter.use(verifyKitchen);

orderRouter.get('/kitchen', getOrders);
orderRouter.patch('/kitchen/:id/status', updateOrders);

export default orderRouter;