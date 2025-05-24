// services/paymentService.js
import api from "./api";

// Simulación de compra directa
export const simulatePurchase = async (items) => {
  const res = await api.post("/pagos/compras-simuladas", { items });
  return res.data;
};
