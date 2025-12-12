import express from 'express';
import { createProduct, getProductById, getProducts, deleteProduct, updateProduct } from '../controllers/productControllers.js';
import { verifyAdmin, authMiddleware } from '../middleware/authMiddleware.js';

const productRouter = express.Router();
productRouter.get('/:id', getProductById);
productRouter.get('/', getProducts);

// productRouter.use(authMiddleware);
// productRouter.use(verifyAdmin);

productRouter.post('/', createProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.patch('/:id', updateProduct);

export default productRouter;