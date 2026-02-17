import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineTrendingUp } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import HealthSummary from '../components/HealthSummary';
import ChartWidget from '../components/ChartWidget';

const Dashboard = () => {
  const { user } = useAuth();
  const notify = useNotification();
  const [todayNutrition, setTodayNutrition] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  const [latestProgress, setLatestProgress] = useState({ weight: 0, bmi: 0 });
  const [nutritionChart, setNutritionChart] = useState([]);
  const [workoutChart, setWorkoutChart] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [nutritionRes, progressRes, nutritionSummary, workoutSummary] = await Promise.allSettled([
        api.get(`/nutrition/logs?date=${today}`),
        api.get('/progress?limit=1'),
        api.get('/nutrition/summary?days=7'),
        api.get('/workouts/summary?days=7')
      ]);

      if (nutritionRes.status === 'fulfilled') {
        setTodayNutrition(nutritionRes.value.data.totals || { calories: 0, protein: 0, fat: 0, carbs: 0 });
        setRecentLogs(nutritionRes.value.data.data?.slice(0, 5) || []);
      }

      if (progressRes.status === 'fulfilled' && progressRes.value.data.data?.length > 0) {
        const latest = progressRes.value.data.data[0];
        setLatestProgress({ weight: latest.weight, bmi: latest.bmi });
      }

      if (nutritionSummary.status === 'fulfilled') {
        setNutritionChart(nutritionSummary.value.data.data || []);
      }

      if (workoutSummary.status === 'fulfilled') {
        setWorkoutChart(workoutSummary.value.data.data || []);
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const healthData = {
    calories: todayNutrition.calories,
    protein: todayNutrition.protein,
    weight: latestProgress.weight,
    bmi: latestProgress.bmi
  };

  // Generate demo data if no real data exists
  const demoNutritionChart = nutritionChart.length > 0 ? nutritionChart : [
    { _id: 'Mon', totalCalories: 1850, totalProtein: 120 },
    { _id: 'Tue', totalCalories: 2100, totalProtein: 145 },
    { _id: 'Wed', totalCalories: 1950, totalProtein: 130 },
    { _id: 'Thu', totalCalories: 2200, totalProtein: 155 },
    { _id: 'Fri', totalCalories: 1800, totalProtein: 110 },
    { _id: 'Sat', totalCalories: 2400, totalProtein: 160 },
    { _id: 'Sun', totalCalories: 2000, totalProtein: 140 },
  ];

  const demoWorkoutChart = workoutChart.length > 0 ? workoutChart : [
    { _id: 'Mon', workoutCount: 2, totalDuration: 45 },
    { _id: 'Tue', workoutCount: 1, totalDuration: 30 },
    { _id: 'Wed', workoutCount: 3, totalDuration: 60 },
    { _id: 'Thu', workoutCount: 0, totalDuration: 0 },
    { _id: 'Fri', workoutCount: 2, totalDuration: 50 },
    { _id: 'Sat', workoutCount: 1, totalDuration: 40 },
    { _id: 'Sun', workoutCount: 2, totalDuration: 35 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="skeleton h-80 rounded-2xl" />
            <div className="skeleton h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-surface-950">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span> 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <HiOutlineCalendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-500/10 px-4 py-2 rounded-xl">
              <HiOutlineTrendingUp className="w-4 h-4" />
              <span>Keep going — you're on track!</span>
            </div>
          </div>
        </motion.div>

        {/* Health Summary Cards */}
        <div className="mb-8">
          <HealthSummary data={healthData} user={user} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartWidget
            title="Calories This Week"
            data={demoNutritionChart}
            type="area"
            dataKeys={[
              { key: 'totalCalories', label: 'Calories' },
            ]}
            height={280}
          />
          <ChartWidget
            title="Workouts This Week"
            data={demoWorkoutChart}
            type="bar"
            dataKeys={[
              { key: 'workoutCount', label: 'Workouts' },
              { key: 'totalDuration', label: 'Duration (min)' }
            ]}
            height={280}
          />
        </div>

        {/* Daily Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6">Daily Goals</h3>
          <div className="space-y-5">
            <GoalBar
              label="Calories"
              current={todayNutrition.calories}
              goal={user?.goals?.dailyCalories || 2000}
              unit="kcal"
              color="from-amber-500 to-orange-500"
            />
            <GoalBar
              label="Protein"
              current={todayNutrition.protein}
              goal={user?.goals?.dailyProtein || 150}
              unit="g"
              color="from-primary-500 to-indigo-500"
            />
            <GoalBar
              label="Fat"
              current={todayNutrition.fat}
              goal={80}
              unit="g"
              color="from-red-400 to-rose-500"
            />
            <GoalBar
              label="Carbs"
              current={todayNutrition.carbs}
              goal={250}
              unit="g"
              color="from-accent-500 to-emerald-500"
            />
          </div>
        </motion.div>

        {/* Recent Meals */}
        {recentLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card mt-6"
          >
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Today's Meals</h3>
            <div className="space-y-3">
              {recentLogs.map((log, i) => (
                <div key={log._id || i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{log.foodName}</p>
                    <p className="text-xs text-gray-400">{log.servingSize}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{log.calories} kcal</p>
                    <p className="text-xs text-gray-400">{log.protein}g protein</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const GoalBar = ({ label, current, goal, unit, color }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(current)} / {goal} {unit}
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
