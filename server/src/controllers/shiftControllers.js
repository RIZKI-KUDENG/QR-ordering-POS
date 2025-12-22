import prisma from "../db/database.js";

export const startShift = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { startCash } = req.body;
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: userId,
        status: "OPEN",
      },
    });

    if (activeShift) {
      return res.status(400).json({ message: "Anda masih memiliki shift yang aktif." });
    }

    const newShift = await prisma.shift.create({
      data: {
        userId: userId,
        startCash: startCash || 0,
        status: "OPEN",
      },
    });

    res.status(201).json({ message: "Shift dimulai", data: newShift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const endShift = async (req, res) => {
  try {
    const userId = req.user.id;
    const { endCash } = req.body; 


    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: userId,
        status: "OPEN",
      },
    });

    if (!activeShift) {
      return res.status(404).json({ message: "Tidak ada shift aktif ditemukan." });
    }

    const endTime = new Date();


    const orders = await prisma.order.findMany({
      where: {
        paid_at: {
          gte: activeShift.startTime,
          lte: endTime,
        },
        status: "COMPLETED", 
      },
    });

    let totalSales = 0;
    let cashSales = 0;
    let onlineSales = 0;

   orders.forEach((order) => {
      const amount = Number(order.total_amount);
      totalSales += amount;
      const method = order.payment_method ? order.payment_method.toUpperCase() : "";

      if (method === "CASH") {
        cashSales += amount;
      } else {
        onlineSales += amount;
      }
    });


    const startCash = Number(activeShift.startCash);
    const expectedCash = startCash + cashSales;
    const actualEndCash = Number(endCash) || 0;
    

    const closedShift = await prisma.shift.update({
      where: { id: activeShift.id },
      data: {
        endTime: endTime,
        endCash: actualEndCash,
        expectedCash: expectedCash,
        totalSales: totalSales,
        cashSales: cashSales,
        onlineSales: onlineSales,
        status: "CLOSED",
      },
    });


    const difference = actualEndCash - expectedCash;

    res.status(200).json({
      message: "Shift berakhir",
      data: {
        ...closedShift,
        difference: difference, 
        differenceNote: difference === 0 ? "Sesuai" : (difference < 0 ? "Kurang (Short)" : "Lebih (Over)"),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCurrentShift = async (req, res) => {
  try {
    const userId = req.user.id;
    const activeShift = await prisma.shift.findFirst({
      where: { userId: userId, status: "OPEN" },
    });

    if (!activeShift) {
      return res.status(200).json({ data: null, message: "Tidak ada shift aktif" });
    }

    res.status(200).json({ data: activeShift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};