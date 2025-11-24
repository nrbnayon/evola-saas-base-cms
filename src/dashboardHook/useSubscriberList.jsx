import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useSubscriberList = () => {
  const [subscriberList, setSubscriberList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchSubscriberList = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/administration/subscriber/list");
        if (mounted) {
          setSubscriberList(res.data || []);
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

    fetchSubscriberList();

    return () => {
      mounted = false;
    };
  }, []);

  return { subscriberList, loading, error };
};

export default useSubscriberList;
