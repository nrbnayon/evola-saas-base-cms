// src/hooks/useServicesRequest.js
import { useEffect, useState, useCallback } from "react";
import apiClient from "../lib/api-client";

const useServicesRequest = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get("/administration/service/request");
      setServices(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
};

export default useServicesRequest;
