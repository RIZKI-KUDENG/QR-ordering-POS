import { getCategories, createCategory } from "../controllers/categoryControllers.js";
import express from "express";

const categoryRouter = express.Router();


categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);

export default categoryRouter;