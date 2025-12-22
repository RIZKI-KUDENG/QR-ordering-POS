import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";


export const useOrders = (page: number = 1) => {
  return useQuery({
    queryKey: ["orders", page], 
    queryFn: async () => {
      const { data } = await api.get(`/orders/kitchen?page=${page}&limit=10`);
      return data; 
    },
    refetchInterval: 5000,
    placeholderData: (previousData) => previousData, 
  });
};

export const useKitchenOrders = () => {
  return useQuery({
    queryKey: ["kitchenOrders"], 
    queryFn: async () => {
      const { data } = await api.get(`/orders/kitchen`);
      return data; 
    },
    refetchInterval: 5000,
  })
}


export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      cashReceived, 
      change 
    }: { 
      id: number; 
      status: string; 
      cashReceived?: number; 
      change?: number;
    }) => {
      return await api.patch(`/orders/kitchen/${id}/status`, { 
        status, 
        cashReceived, 
        change 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["kitchenOrders"] });
    },
  });
};