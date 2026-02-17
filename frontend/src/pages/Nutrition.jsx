import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import NutritionCard from '../components/NutritionCard';
import VoiceLogButton from '../components/VoiceLogButton';
import useFetchNutrition from '../hooks/useFetchNutrition';

const Nutrition = () => {
  const notify = useNotification();
  const { results, loading: searchLoading, searchFood, clearResults } = useFetchNutrition();
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState('snack');

  useEffect(() => {
    fetchTodayLogs();
  }, []);

  const fetchTodayLogs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get(`/nutrition/logs?date=${today}`);
      setLogs(res.data.data || []);
      setTotals(res.data.totals || { calories: 0, protein: 0, fat: 0, carbs: 0 });
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchFood(searchQuery);
      } else {
        clearResults();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddFood = async (food) => {
    try {
      const payload = {
        foodName: food.label || food.foodName,
        calories: food.calories || 0,
        protein: food.protein || 0,
        fat: food.fat || 0,
        carbs: food.carbs || 0,
        servingSize: '100g',
        mealType
      };
      const res = await api.post('/nutrition/log', payload);
      notify.success(res.data.note || `Logged ${payload.foodName}`);
      fetchTodayLogs();
      setSearchQuery('');
      clearResults();
    } catch (err) {
      notify.error('Failed to log food');
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.delete(`/nutrition/log/${id}`);
      notify.success('Entry removed');
      fetchTodayLogs();
    } catch (err) {
      notify.error('Failed to delete');
    }
  };

  const handleVoiceResult = useCallback((parsed) => {
    if (parsed && parsed.food) {
      setSearchQuery(parsed.food);
      notify.info(`Voice: "${parsed.raw}" → searching "${parsed.food}"`);
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-surface-950">
      <div className="container-custom">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Nutrition <span className="gradient-text">Tracker</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Search, log, and track your daily nutrition</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Search + Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-static"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search food... (e.g., chicken, rice, banana)"
                    className="glass-input w-full !pl-11"
                  />
                </div>
                <VoiceLogButton onResult={handleVoiceResult} />
              </div>

              {/* Meal Type Selector */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-400 mr-1">Meal:</span>
                {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                      mealType === type
                        ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Search Results */}
            {searchLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
              </div>
            )}

            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Search Results ({results.length})
                  </h3>
                  {results.map((food, i) => (
                    <NutritionCard key={food.foodId || i} food={food} onAdd={handleAddFood} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {searchQuery.length >= 2 && !searchLoading && results.length === 0 && (
              <div className="glass-card text-center py-8">
                <p className="text-gray-400">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Right: Today's Log */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Totals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-static"
            >
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Today's Totals</h3>
              <div className="grid grid-cols-2 gap-4">
                <TotalItem label="Calories" value={totals.calories} unit="kcal" color="text-amber-500" />
                <TotalItem label="Protein" value={totals.protein} unit="g" color="text-primary-500" />
                <TotalItem label="Fat" value={totals.fat} unit="g" color="text-red-400" />
                <TotalItem label="Carbs" value={totals.carbs} unit="g" color="text-accent-500" />
              </div>
            </motion.div>

            {/* Today's Logs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Today's Log ({logs.length} entries)
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {logs.map((log) => (
                      <NutritionCard key={log._id} food={log} onDelete={handleDeleteLog} isLogged />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="glass-card text-center py-8">
                  <p className="text-gray-400 text-sm">No meals logged today</p>
                  <p className="text-gray-400 text-xs mt-1">Search for food above to get started</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TotalItem = ({ label, value, unit, color }) => (
  <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
    <div className={`text-xl font-bold ${color}`}>{Math.round(value)}</div>
    <div className="text-xs text-gray-400 mt-0.5">{label} ({unit})</div>
  </div>
);

export default Nutrition;
