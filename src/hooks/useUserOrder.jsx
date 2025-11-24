import { useEffect, useState } from 'react';
import apiClient from '../lib/api-client';

const useUserOrder = () => {
   const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/user/order-history");
        if (mounted) {
          setOrders(res.data || []);
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

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []);

  return { orders, loading, error };
};

export default useUserOrder;