import { useCallback, useEffect, useState } from 'react';
import apiClient from '../lib/api-client';
import { getCookie } from '../lib/cookie-utils';

const useMe = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = getCookie('access_token');
    if (!token) {
      setError('No access token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.get('/user/retrieve');
      setUser(res.data || null);
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
};

export default useMe;