import { createOrderService } from "../services/orderService.js";
import prisma from "../db/database.js";

export const createOrder = async (req, res) => {
  try {
    const { tableToken, items, paymentMethod } = req.body;

    const result = await createOrderService({ tableToken, items, paymentMethod });

    res.status(201).json({
      message: "Order created",
      orderId: result.orderId,
      snapToken: result.snapToken,
      redirectUrl: result.redirectUrl,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create order",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await prisma.order.count();

    const orders = await prisma.order.findMany({
      skip: skip, 
      take: limit, 
      include: {
        table: true,
        items: {
          include: {
            product: true,
            selectedOptions: { include: { variantOption: true } },
          },
        },
      },
      orderBy: {
        created_at: "desc", 
      },
    });
    res.status(200).json({
      data: orders,
      pagination: {
        totalItems: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        itemsPerPage: limit,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const {status, cashReceived, change } = req.body;
    const updateData = {status};
    if (cashReceived !== undefined) updateData.cash_received = cashReceived;
    if (change !== undefined) updateData.change = change;
    await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });
    const io = req.app.get("socketio");

    io.to(`order-${id}`).emit("order-status-updated", {
      orderId : id,
      status,
    });
    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
