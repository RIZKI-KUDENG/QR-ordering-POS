import express from 'express';
import { createProduct, getProductById, getProducts, deleteProduct, updateProduct } from '../controllers/productControllers.js';

const productRouter = express.Router();

productRouter.post('/', createProduct);
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);

export default productRouter;