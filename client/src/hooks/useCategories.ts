import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";// Asumsi Anda sudah membuat instance axios di sini

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },
  });
};