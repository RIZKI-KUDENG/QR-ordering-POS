import { createOrderService } from "../services/orderService.js";
import prisma from "../db/database.js";

export const createOrder = async (req, res) => {
  try {
    const { tableToken, items } = req.body;

    const result = await createOrderService({ tableToken, items });

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
    const orders = await prisma.order.findMany({
      include: {
        table: true,
        items: {
          include: {
            product: true,
            selectedOptions: {
              include: { variantOption: true },
            },
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status: status,
      },
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
