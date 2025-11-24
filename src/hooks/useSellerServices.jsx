import { useCallback, useEffect, useState } from 'react';
import apiClient from '../lib/api-client';

const useSellerServices = () => {
   const [service, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/service/list");
      setServices(res.data || null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setServices(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { service, loading, error, refetch: fetchServices };
};

export default useSellerServices;