import { useEffect, useState } from "react";
import apiClient from "../lib/api-client";

const useUserList = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchUserList = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/administration/user/list");
        if (mounted) {
          setUserList(res.data || []);
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

    fetchUserList();

    return () => {
      mounted = false;
    };
  }, []);

  return { userList, loading, error };
};

export default useUserList;
