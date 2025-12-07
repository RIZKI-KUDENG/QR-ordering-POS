import express from 'express';
import { getTables, createTable, getTableById, updateTable, getTableByToken } from '../controllers/tableControllers.js';

const tableRouter = express.Router();

tableRouter.get('/', getTables);
tableRouter.post('/', createTable);
tableRouter.get('/:id', getTableById);
tableRouter.put('/:id', updateTable);
tableRouter.get('/scan/:token', getTableByToken);

export default tableRouter;