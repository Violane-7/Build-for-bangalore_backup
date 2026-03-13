import { useState, useEffect, useCallback } from "react";
import { getMetrics, logMetrics } from "../services/healthService";

// Hook for managing user health metrics
export function useHealthMetrics() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMetrics();
      setMetrics(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  const addMetrics = async (data) => {
    try {
      await logMetrics(data);
      await fetchMetrics();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log metrics");
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics, addMetrics };
}
