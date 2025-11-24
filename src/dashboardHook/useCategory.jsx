import { useEffect, useState } from 'react';
import apiClient from '../lib/api-client';

const useCategory = () => {
   const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/administration/category/list");
        if (mounted) {
          setCategories(res.data || []);
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

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return { categories, loading, error };
};

export default useCategory;