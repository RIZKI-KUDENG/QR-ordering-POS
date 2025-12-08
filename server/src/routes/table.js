import express from 'express';
import { getTables, createTable, getTableById, updateTable, getTableByToken } from '../controllers/tableControllers.js';
import { verifyAdmin, authMiddleware } from '../middleware/authMiddleware.js';

const tableRouter = express.Router();
tableRouter.get('/scan/:token', getTableByToken);

tableRouter.use(authMiddleware);


tableRouter.get('/', getTables);
tableRouter.get('/:id', getTableById);
tableRouter.post('/', verifyAdmin, createTable);
tableRouter.put('/:id', verifyAdmin, updateTable);

export default tableRouter;