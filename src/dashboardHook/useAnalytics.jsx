import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/administration/dashboard/analytics");
        if (mounted) {
          setAnalytics(res.data || []);
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

    fetchAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return { analytics, loading, error };
};

export default useAnalytics;
