// src/hooks/useServicesList.js
import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useCategoriesData = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/site/category/list");
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

    fetchCategory();

    return () => {
      mounted = false;
    };
  }, []);

  return { categories, loading, error };
};

export default useCategoriesData;
