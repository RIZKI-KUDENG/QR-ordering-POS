import express from 'express';
import { getTables, createTable, getTableById, updateTable, getTableByToken, deleteTable} from '../controllers/tableControllers.js';
import { verifyAdmin, authMiddleware } from '../middleware/authMiddleware.js';

const tableRouter = express.Router();
tableRouter.get('/scan/:token', getTableByToken);

// tableRouter.use(authMiddleware);


tableRouter.get('/', getTables);
tableRouter.get('/:id', getTableById);
tableRouter.post('/',  createTable);
tableRouter.put('/:id',  updateTable);
tableRouter.delete('/:id',  deleteTable);

export default tableRouter;