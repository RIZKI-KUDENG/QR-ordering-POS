import express from 'express';
import { createOrder, getOrders, updateOrders } from '../controllers/orderControllers.js';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.get('/kitchen', getOrders);
orderRouter.patch('/kitchen/:id/status', updateOrders);

export default orderRouter;