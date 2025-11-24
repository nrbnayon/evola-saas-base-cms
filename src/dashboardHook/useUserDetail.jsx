import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useUserDetail = (role, id) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!id) {
        setError("No ID provided");
        setLoading(false);
        return;
      }

      const endpoint = role === "Seller"
        ? `/administration/seller/details/${id}`
        : `/administration/user/details/${id}`;

      console.log("Fetching:", endpoint);

      try {
        setLoading(true);
        const res = await apiClient.get(endpoint);
        console.log("Success:", res.data);
        if (mounted) setDetail(res.data);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        if (mounted) {
          setError(
            err.response?.data?.message ||
            `Failed to load ${role} (ID: ${id})`
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [role, id]);

  return { detail, loading, error };
};

export default useUserDetail;