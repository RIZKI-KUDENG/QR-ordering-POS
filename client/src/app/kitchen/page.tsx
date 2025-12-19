"use client";

import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function KitchenPage() {
  const { data: orders = [], isLoading } = useOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const kitchenOrders = orders.filter(
    (o: any) => o.status === "PENDING" || o.status === "COOKING"
  );

  console.log("Kitchen Orders:", kitchenOrders);

  if (isLoading) {
    return (
      <div className="p-8 text-2xl font-bold">
        Memuat pesanan...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          👨‍🍳 Kitchen Display
        </h1>
        <span className="text-sm text-gray-500">
          Auto-refresh setiap 5 detik
        </span>
      </div>

      {/* Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kitchenOrders.length === 0 ? (
          <p className="text-gray-500">
            Tidak ada pesanan aktif.
          </p>
        ) : (
          kitchenOrders.map((order: any) => (
            <Card
              key={order.id}
              className="overflow-hidden border-l-8 border-yellow-400"
            >
              {/* Card Header */}
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold">
                    Meja {order.table?.number}
                  </CardTitle>
                  <span className="text-sm text-gray-500">
                    #{order.id}
                  </span>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="p-4 space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="border-b pb-2 last:border-0"
                  >
                    <div className="font-medium text-lg">
                      <span className="font-bold">
                        {item.quantity}x
                      </span>{" "}
                      {item.product_id}
                    </div>

                    {/* Variant Options */}
                    {item.selectedOptions?.length > 0 && (
                      <div className="text-sm text-gray-500 ml-6">
                        {item.selectedOptions
                          .map((opt: any) => opt.variantOption.name)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>

              {/* Actions */}
              <div className="p-4 bg-gray-50 flex gap-2">
                {order.status === "PENDING" && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() =>
                      updateStatus({
                        id: order.id,
                        status: "COOKING",
                      })
                    }
                  >
                    Mulai Masak
                  </Button>
                )}

                {order.status === "COOKING" && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() =>
                      updateStatus({
                        id: order.id,
                        status: "SERVED",
                      })
                    }
                  >
                    Selesai / Hidangkan
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
