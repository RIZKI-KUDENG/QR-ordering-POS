import {Table} from '../db';

export const getTables = async (req, res) => {
    try {
        const tables = await Table.findMany();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getTableById = async (req, res) => {
    try {
        const table = await Table.findUnique({
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
        const table = await Table.create({
            data: req.body
        });
        res.status(201).json(table);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateTable = async (req, res) => {
    try {
        const table = await Table.update({
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