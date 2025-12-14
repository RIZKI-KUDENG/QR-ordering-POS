import prisma from "../db/database.js";
import { generateTableToken } from "../utils/generateTableToken.js";

export const getTables = async (req, res) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {
        number: "asc",
      },
    });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const table = await prisma.table.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTable = async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ message: "Number is required" });
    }
    const table = await prisma.table.create({
      data: {
        number,
        token: generateTableToken(),
      },
    });
    res.status(201).json(table);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Table already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await prisma.table.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTableByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const table = await prisma.table.findUnique({
      where: { token: token },
      select: { id: true, number: true },
    });

    if (!table) return res.status(404).json({ message: "QR Code tidak valid" });

    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTable = async (req, res) => {
 try {
    const id = Number(req.params.id);

    const table = await prisma.table.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!table) {
      return res.status(404).json({ message: "Meja tidak ditemukan" });
    }

    if (table.orders.length > 0) {
      return res.status(400).json({
        message: "Meja tidak bisa dihapus karena sudah memiliki pesanan",
      });
    }

    await prisma.table.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE TABLE ERROR:", error);

    res.status(500).json({
      message: "Gagal menghapus meja",
      prismaCode: error.code,
    });
  }
};
