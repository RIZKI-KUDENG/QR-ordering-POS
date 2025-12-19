import prisma from "../db/database.js";
import midtransClient from "midtrans-client";

export const createOrderService = async (payload) => {
  const { tableToken, items, paymentMethod } = payload;

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

  // 2. Transaction
  const { order, finalTotalPrice } = await prisma.$transaction(async (tx) => {
    let totalPrice = 0;
    const enrichedItems = [];

    // Hitung total dan siapkan data item
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Produk dengan id ${item.productId} tidak ditemukan`);
      }

      const qty = parseInt(item.quantity);
      if (!qty || qty <= 0) {
        throw new Error(`Quantity untuk produk ${product.name} tidak valid`);
      }

      const priceVal = product.price ? product.price.toString() : "0";
      const basePrice = Number(priceVal);

      // Ambil opsi
      let optionRecords = [];
      let optionsExtraTotalPerQty = 0;

      if (item.selectedOptions && item.selectedOptions.length > 0) {
        optionRecords = await tx.variantOption.findMany({
          where: {
            id: { in: item.selectedOptions },
          },
        });

        if (optionRecords.length !== item.selectedOptions.length) {
          throw new Error(
            `Beberapa opsi untuk produk ${product.name} tidak valid`
          );
        }

        optionsExtraTotalPerQty = optionRecords.reduce((sum, opt) => {
          // Gunakan 'extra_price' sesuai schema.prisma
          const extraPriceVal = opt.extra_price
            ? opt.extra_price.toString()
            : "0";
          return sum + Number(extraPriceVal);
        }, 0);
      }

      // Hitung subtotal
      const itemSubtotal = (basePrice + optionsExtraTotalPerQty) * qty;

      if (isNaN(itemSubtotal)) {
        throw new Error(
          `Perhitungan error: Harga produk ${product.name} menghasilkan NaN.`
        );
      }

      totalPrice += itemSubtotal;

      // Simpan detail item
      enrichedItems.push({
        product,
        quantity: qty,
        options: [],
        unitPrice: basePrice,
        itemSubtotal,
      });
    }

    // Buat Order
    const createdOrder = await tx.order.create({
      data: {
        table: {
          connect: {
            id: table.id,
          },
        },
        status: "PENDING",
        total_amount: totalPrice,
        payment_method: paymentMethod || "MIDTRANS",
      },
    });

    // Buat OrderItem dan OrderItemOption
    for (const enriched of enrichedItems) {
      const orderItem = await tx.orderItem.create({
        data: {
          order_id: createdOrder.id,
          product_id: enriched.product.id,
          quantity: enriched.quantity,
          price: enriched.unitPrice,
        },
      });

      if (enriched.options.length > 0) {
        await tx.orderItemOption.createMany({
          data: enriched.options.map((opt) => ({
            order_item_id: orderItem.id,
            variant_option_id: opt.id,
          })),
        });
      }
    }

    return { order: createdOrder, finalTotalPrice: totalPrice };
  });

  // 3. Midtrans (Luar Transaction)
if (paymentMethod === "CASH") {
    return {
      message: "Order created (Cash)",
      orderId: order.id,
      snapToken: null, 
      redirectUrl: null,
    };
  } else {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const snapPayload = {
      transaction_details: {
        order_id: order.id.toString(),
        gross_amount: Math.round(finalTotalPrice),
      },
      credit_card: { secure: true },
    };

    const snapResponse = await snap.createTransaction(snapPayload);

    return {
      message: "Order created",
      orderId: order.id,
      snapToken: snapResponse.token,
      redirectUrl: snapResponse.redirect_url,
    };
  }
};