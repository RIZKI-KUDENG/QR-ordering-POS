import api from "@/lib/axios";

export const getCurrentShift = async () => {
  const response = await api.get("/shifts/current");
  return response.data; 
};

export const startShift = async (startCash: number) => {
  const response = await api.post("/shifts/start", { startCash });
  return response.data;
};

export const endShift = async (endCash: number) => {
  const response = await api.post("/shifts/end", { endCash });
  return response.data; 
};