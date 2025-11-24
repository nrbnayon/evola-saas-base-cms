import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useOrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchOrderList = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/administration/order/list");
        if (mounted) {
          setOrderList(res.data || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrderList();

    return () => {
      mounted = false;
    };
  }, []);

  return { orderList, loading, error };
};

export default useOrderList;
