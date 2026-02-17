import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ChartWidget from '../components/ChartWidget';

const Progress = () => {
  const { user } = useAuth();
  const notify = useNotification();
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ weight: '', notes: '' });
  const [period, setPeriod] = useState('weekly');

  useEffect(() => { fetchProgress(); fetchSummary(); }, [period]);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress?limit=90');
      setEntries(res.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/progress/summary?period=${period}`);
      setSummary(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight) return notify.error('Weight is required');
    try {
      await api.post('/progress', { weight: Number(formData.weight), notes: formData.notes });
      notify.success('Progress logged! 📊');
      setFormData({ weight: '', notes: '' });
      setShowForm(false);
      fetchProgress(); fetchSummary();
    } catch (err) { notify.error('Failed to save progress'); }
  };

  const chartData = [...entries].reverse().map(e => ({
    _id: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: e.weight, bmi: e.bmi
  }));

  const demo = chartData.length > 0 ? chartData : [
    { _id: 'Jan 1', weight: 80, bmi: 26.1 }, { _id: 'Jan 8', weight: 79.5, bmi: 25.9 },
    { _id: 'Jan 15', weight: 79, bmi: 25.7 }, { _id: 'Jan 22', weight: 78.2, bmi: 25.5 },
    { _id: 'Jan 29', weight: 77.8, bmi: 25.3 }, { _id: 'Feb 5', weight: 77, bmi: 25.1 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-surface-950">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">Progress <span className="gradient-text">Tracker</span></h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor your weight, BMI, and body composition</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2 !py-2.5"><HiOutlinePlus className="w-4 h-4" /> Add Entry</button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-static mb-8">
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Weight (kg) *</label>
                <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData(f => ({ ...f, weight: e.target.value }))} className="glass-input w-full" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Notes</label>
                <input type="text" value={formData.notes} onChange={(e) => setFormData(f => ({ ...f, notes: e.target.value }))} className="glass-input w-full" placeholder="Optional" />
              </div>
              <div className="flex items-end"><button type="submit" className="btn-accent w-full !py-3">Save</button></div>
            </form>
          </motion.div>
        )}

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SCard label="Current Weight" value={summary.endWeight ? `${summary.endWeight} kg` : '—'} change={summary.weightChange ? `${summary.weightChange > 0 ? '+' : ''}${summary.weightChange} kg` : null} positive={summary.weightChange <= 0} />
            <SCard label="BMI" value={summary.latestBmi || '—'} />
            <SCard label="Avg BMI" value={summary.avgBmi || '—'} />
            <SCard label="Entries" value={summary.entries || 0} />
          </div>
        )}

        <div className="flex items-center gap-2 mb-6">
          {['weekly', 'monthly'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${period === p ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>{p}</button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartWidget title="Weight Trend" data={demo} type="line" dataKeys={[{ key: 'weight', label: 'Weight (kg)' }]} height={300} />
          <ChartWidget title="BMI History" data={demo} type="bar" dataKeys={[{ key: 'bmi', label: 'BMI' }]} height={300} />
        </div>

        {entries.length > 0 && (
          <div className="glass-card-static overflow-x-auto">
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">History</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">Weight</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">BMI</th>
              </tr></thead>
              <tbody>{entries.slice(0, 15).map((e) => (
                <tr key={e._id} className="border-b border-gray-100 dark:border-white/5 last:border-0">
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="py-3 px-2 text-right font-semibold text-gray-900 dark:text-white">{e.weight} kg</td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{e.bmi}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const SCard = ({ label, value, change, positive }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4">
    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</div>
    {change && <div className={`text-xs mt-1 ${positive ? 'text-accent-500' : 'text-red-400'}`}>{change}</div>}
  </motion.div>
);

export default Progress;
