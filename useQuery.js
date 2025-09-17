import { useState, useEffect, useCallback } from 'react';

export const useQuery = (queryFn, deps = [], options = {}) => {
  const { enabled = true } = options;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled);

  const executeQuery = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      if (result.error) {
        throw result.error;
      }
      setData(result.data);
    } catch (err) {
      setError(err);
      console.error("useQuery Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, enabled, ...deps]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  return { data, error, isLoading, refetch: executeQuery };
};