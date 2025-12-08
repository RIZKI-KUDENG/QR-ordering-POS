import prisma from "../db/database.js";


export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variants: {
                    include: {options : true}
                }
            }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createProduct = async (req, res) => {
    try {
        const product = await prisma.product.create({
            data: req.body
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await prisma.product.update({
            where: {
                id: req.params.id
            },
            data: req.body
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await prisma.product.delete({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}