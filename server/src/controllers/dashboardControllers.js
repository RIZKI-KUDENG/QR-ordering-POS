import prisma from "../db/database.js";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await prisma.order.aggregate({
      _sum: { total_amount: true },
      where: {
        created_at: { gte: today },
        status: { in: ["PAID", "COMPLETED"] },
      },
    });
    const todayOrders = await prisma.order.count({
      where: {
        created_at: { gte: today },
      },
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ["product_id"],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 5,
    });
    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.product_id },
        });
        return {
          name: product?.name || "Unknown",
          sold: item._sum.quantity,
        };
      })
    );

    res.json({
      revenue: todayRevenue._sum.total_amount || 0,
      ordersCount: todayOrders,
      topProducts: topProductsDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};