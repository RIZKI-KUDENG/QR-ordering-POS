import prisma from "../db/database.js";

export const getTables = async (req, res) => {
    try {
        const tables = await prisma.table.findMany();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getTableById = async (req, res) => {
    try {
        const table = await prisma.table.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createTable = async (req, res) => {
    try {
        const table = await prisma.table.create({
            data: req.body
        });
        res.status(201).json(table);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateTable = async (req, res) => {
    try {
        const table = await prisma.table.update({
            where: {
                id: req.params.id
            },
            data: req.body
        });
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getTableByToken = async (req, res) => {
    try {
        const { token } = req.params; 
        const table = await prisma.table.findUnique({
            where: { token: token },
            select: { id: true, number: true } 
        });
        
        if (!table) return res.status(404).json({message: "QR Code tidak valid"});
        
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}