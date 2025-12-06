import express from 'express';
import { login, register } from '../controllers/authControllers.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);

export default authRouter;