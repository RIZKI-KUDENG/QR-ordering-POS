import express from 'express';
import { createOrder, getOrders, updateOrders, getOrderById, getKitchenOrders } from '../controllers/orderControllers.js';
import { verifyKitchen, authMiddleware } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();
orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders);
orderRouter.get('/kitchen', getKitchenOrders);
orderRouter.get('/:id', getOrderById);
// orderRouter.use(authMiddleware);
// orderRouter.use(verifyKitchen);

orderRouter.patch('/kitchen/:id/status', updateOrders);

export default orderRouter;