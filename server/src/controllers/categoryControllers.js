import prisma from "../db/database.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createCategory = async (req, res) => {
    try {
        const category = await prisma.category.create({
            data: req.body
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}