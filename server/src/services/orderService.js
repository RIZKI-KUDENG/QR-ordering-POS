import prisma from "../db/database.js";

export const createOrderService = async (payload) => {
  const { tableToken, items } = payload;

  if (!tableToken || !Array.isArray(items) || items.length === 0) {
    throw new Error("tableToken dan items wajib diisi");
  }

  // 1. Validasi meja
  const table = await prisma.table.findUnique({
    where: {
      token: tableToken,
    },
  });

  if (!table) {
    throw new Error("Meja tidak valid");
  }

  // 2. transaction
  const order = await prisma.$transaction(async (tx) => {
    let totalPrice = 0;
    const enrichedItems = [];

    // hitung total dan siapkan data item
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Produk dengan id ${item.productId} tidak ditemukan`);
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Quantity untuk produk ${product.name} tidak valid`);
      }

      // Harga asli produk 
      const basePrice = product.price;

      // Ambil opsi 
      let optionRecords = [];
      let optionsExtraTotalPerQty = 0;

      if (item.selectedOptions && item.selectedOptions.length > 0) {
        optionRecords = await tx.productOption.findMany({
          where: {
            id: { in: item.selectedOptions },
          },
        });

        if (optionRecords.length !== item.selectedOptions.length) {
          throw new Error(
            `Beberapa opsi untuk produk ${product.name} tidak valid`
          );
        }

        optionsExtraTotalPerQty = optionRecords.reduce(
          (sum, opt) => sum + opt.extraPrice,
          0
        );
      }

      // subtotal = (harga produk + total extra per porsi) * quantity
      const itemSubtotal =
        (basePrice + optionsExtraTotalPerQty) * item.quantity;

      totalPrice += itemSubtotal;

      // Simpan detail item + opsi untuk OrderItem
      enrichedItems.push({
        product,
        quantity: item.quantity,
        options: optionRecords,
        unitPrice: basePrice,
        itemSubtotal,
      });
    }

    //buat Order
    const createdOrder = await tx.order.create({
      data: {
        tableId: table.id,
        status: "PENDING",
        total: totalPrice,
      },
    });

    // buat OrderItem dan OrderItemOption
    for (const enriched of enrichedItems) {
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          productId: enriched.product.id,
          quantity: enriched.quantity,
          unitPrice: enriched.unitPrice,
          subtotal: enriched.itemSubtotal,
        },
      });

      if (enriched.options.length > 0) {
        await tx.orderItemOption.createMany({
          data: enriched.options.map((opt) => ({
            orderItemId: orderItem.id,
            optionId: opt.id,
            extraPrice: opt.extraPrice,
          })),
        });
      }
    }

    return createdOrder;
  });

  return order;
};
