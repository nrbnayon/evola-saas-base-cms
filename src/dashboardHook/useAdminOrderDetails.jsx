import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useAdminOrderDetails = (orderId) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchOrderDetails = async () => {
      console.log("Fetching order details for orderId:", orderId);
      try {
        setLoading(true);
        const res = await apiClient.get(`/administration/order/details/${orderId}`);
        console.log("API response:", res.data);
        if (mounted) {
          setOrderDetails(res.data || null);
        }
      } catch (err) {
        console.error("API error:", err);
        if (mounted) {
          setError(err.response?.data?.message || err.message || "Failed to fetch order details");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      console.log("No orderId provided, skipping API call");
      setError("No order ID provided");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [orderId]);

  return { orderDetails, loading, error };
};

export default useAdminOrderDetails;