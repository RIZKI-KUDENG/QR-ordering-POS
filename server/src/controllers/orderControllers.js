import { createOrderService } from "../services/orderService.js";

export const createOrder = async (req, res) => {
  try {
    const { tableToken, items } = req.body;

    const order = await createOrderService({ tableToken, items });

    res.status(201).json({
      message: "Order created",
      orderId: order.id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create order",
    });
  }
};
