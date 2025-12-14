import api from "@/lib/axios";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useTable = () => {
    return useQuery({
        queryKey: ["tables"],
        queryFn: async () => {
            const { data } = await api.get("/tables");
            return data;
        },
    });
};

export const useCreateTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post("/tables", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
        onError: (error) => {
            console.error("Gagal membuat produk:", error);
        },
    });
};

export const useDeleteTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/tables/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
        onError: (error : any) => {
            const message = error?.response?.data?.message || "Gagal menghapus produk";
            alert(message);
        }
    });
};

export const useTableByToken = (token: string) => {
    return useQuery({
        queryKey: ["table-token", token],
        queryFn: async () => {
            const res = await api.get(`/tables/scan/${token}`);
            return res.data;
        },
        enabled: !!token,
        retry: false
    })
}