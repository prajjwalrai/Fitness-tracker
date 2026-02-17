import { useState, useCallback } from 'react';
import api from '../services/api';

const useFetchNutrition = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFood = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/nutrition/search?query=${encodeURIComponent(query)}`);
      setResults(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, searchFood, clearResults };
};

export default useFetchNutrition;
