import prisma from "../../db/database.js"


export const midtransWebhook = async (req, res) => {
  try {
    const {
      order_id,
      transaction_status,
      fraud_status,
    } = req.body;
const cleanOrderId = String(order_id).split('-')[0];
    const isPaid =
      transaction_status === "capture" ||
      transaction_status === "settlement";

    if (isPaid) {
      await prisma.order.update({
        where: { id: Number(order_id) },
        data: { status: "PAID" },
      });
      const io = req.app.get("socketio");
     io.emit('new order', {
        message: "Pesanan Baru",
        orderId: cleanOrderId
      });

      io.to(`order-${cleanOrderId}`).emit("order-status-updated", {
        orderId: cleanOrderId,
        status: "PAID"
      });
    }

    return res.status(200).json({ message: "OK" }); 
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Webhook error", error });
  }
};
