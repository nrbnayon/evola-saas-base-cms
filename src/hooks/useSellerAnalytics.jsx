import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../lib/api-client';

const useSellerAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/seller/dashboard/analytics");
      setAnalytics(res.data || null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};


export default useSellerAnalytics;