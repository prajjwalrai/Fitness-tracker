import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import WorkoutCard from '../components/WorkoutCard';

const muscles = ['', 'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest', 'forearms', 'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 'shoulders', 'traps', 'triceps'];
const difficulties = ['', 'beginner', 'intermediate', 'expert'];

const Workout = () => {
  const notify = useNotification();
  const [exercises, setExercises] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [logModalExercise, setLogModalExercise] = useState(null);
  const [logForm, setLogForm] = useState({ sets: 3, reps: 12, duration: 30 });

  useEffect(() => {
    fetchTodayLogs();
    searchExercises();
  }, []);

  const searchExercises = async (muscle, difficulty) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (muscle || selectedMuscle) params.append('muscle', muscle || selectedMuscle);
      if (difficulty || selectedDifficulty) params.append('difficulty', difficulty || selectedDifficulty);
      const res = await api.get(`/workouts/search?${params}`);
      setExercises(res.data.data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayLogs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get(`/workouts/logs?date=${today}`);
      setLogs(res.data.data || []);
    } catch (err) {
      console.error('Fetch logs error:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleOpenLog = (exercise) => {
    setLogModalExercise(exercise);
    setLogForm({ sets: 3, reps: 12, duration: 30 });
  };

  const handleLogWorkout = async () => {
    if (!logModalExercise) return;
    try {
      await api.post('/workouts/log', {
        exerciseName: logModalExercise.name,
        muscle: logModalExercise.muscle,
        difficulty: logModalExercise.difficulty,
        equipment: logModalExercise.equipment,
        type: logModalExercise.type,
        instructions: logModalExercise.instructions,
        sets: logForm.sets,
        reps: logForm.reps,
        duration: logForm.duration
      });
      notify.success(`Logged ${logModalExercise.name} 💪`);
      setLogModalExercise(null);
      fetchTodayLogs();
    } catch (err) {
      notify.error('Failed to log workout');
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.delete(`/workouts/log/${id}`);
      notify.success('Workout log removed');
      fetchTodayLogs();
    } catch (err) {
      notify.error('Failed to delete');
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'muscle') {
      setSelectedMuscle(value);
      searchExercises(value, selectedDifficulty);
    } else {
      setSelectedDifficulty(value);
      searchExercises(selectedMuscle, value);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-surface-950">
      <div className="container-custom">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Workout <span className="gradient-text">Center</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse exercises, log workouts, and track training</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-static mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Muscle Group</label>
              <select
                value={selectedMuscle}
                onChange={(e) => handleFilterChange('muscle', e.target.value)}
                className="glass-input w-full capitalize"
              >
                <option value="">All Muscles</option>
                {muscles.filter(m => m).map(m => (
                  <option key={m} value={m} className="capitalize">{m.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="glass-input w-full capitalize"
              >
                <option value="">All Levels</option>
                {difficulties.filter(d => d).map(d => (
                  <option key={d} value={d} className="capitalize">{d}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Exercise Library */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Exercises ({exercises.length})
            </h3>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {exercises.map((ex, i) => (
                  <WorkoutCard key={ex.name + i} exercise={ex} onAdd={handleOpenLog} />
                ))}
              </div>
            )}
          </div>

          {/* Today's Workouts */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Today's Workouts ({logs.length})
            </h3>
            {logsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
              </div>
            ) : logs.length > 0 ? (
              <AnimatePresence>
                {logs.map((log) => (
                  <WorkoutCard key={log._id} exercise={log} onDelete={handleDeleteLog} isLogged />
                ))}
              </AnimatePresence>
            ) : (
              <div className="glass-card text-center py-8">
                <p className="text-gray-400 text-sm">No workouts logged today</p>
                <p className="text-gray-400 text-xs mt-1">Click + on any exercise to log it</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {logModalExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setLogModalExercise(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card-static w-full max-w-md"
            >
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1">
                Log Workout
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{logModalExercise.name}</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sets</label>
                  <input
                    type="number"
                    value={logForm.sets}
                    onChange={(e) => setLogForm(f => ({ ...f, sets: Number(e.target.value) }))}
                    className="glass-input w-full text-center"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Reps</label>
                  <input
                    type="number"
                    value={logForm.reps}
                    onChange={(e) => setLogForm(f => ({ ...f, reps: Number(e.target.value) }))}
                    className="glass-input w-full text-center"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                  <input
                    type="number"
                    value={logForm.duration}
                    onChange={(e) => setLogForm(f => ({ ...f, duration: Number(e.target.value) }))}
                    className="glass-input w-full text-center"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setLogModalExercise(null)} className="btn-outline flex-1 !py-2.5">Cancel</button>
                <button onClick={handleLogWorkout} className="btn-primary flex-1 !py-2.5">Log Workout</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workout;
