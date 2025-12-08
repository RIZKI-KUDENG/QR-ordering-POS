import { createOrderService } from "../services/orderService.js";

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
        items: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrders = async (req, res) => {
  try {
    const { id, status } = req.body;
    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
