// src/hooks/useServicesList.js
import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/site/service/list");
        if (mounted) {
          setServices(res.data || []);
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

    fetchServices();

    return () => {
      mounted = false;
    };
  }, []);

  return { services, loading, error };
};

export default useServicesList;
