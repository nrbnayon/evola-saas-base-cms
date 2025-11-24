import { useEffect, useState, useCallback } from "react";
import apiClient from "../lib/api-client";

const useSellerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get("/seller/order/list");
      setOrders(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 🔁 expose refetch so you can call it manually
  return { orders, loading, error, refetch: fetchOrders };
};

export default useSellerOrderList;
