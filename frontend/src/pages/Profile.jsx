import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePhotograph, HiOutlineSave } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const notify = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    height: user?.height || 170,
    goals: {
      targetWeight: user?.goals?.targetWeight || 70,
      dailyCalories: user?.goals?.dailyCalories || 2000,
      dailyProtein: user?.goals?.dailyProtein || 150,
      dailySteps: user?.goals?.dailySteps || 10000,
    },
    notifications: user?.notifications ?? true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('goals.')) {
      const field = name.split('.')[1];
      setForm(f => ({ ...f, goals: { ...f.goals, [field]: Number(value) } }));
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      notify.success('Profile updated! ✨');
    } catch (err) {
      notify.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return notify.error('Image must be under 2MB');
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await api.put('/users/profile', { avatar: reader.result });
        updateUser({ avatar: reader.result });
        notify.success('Avatar updated!');
      } catch (err) { notify.error('Avatar upload failed'); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-surface-950">
      <div className="container-custom max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">Your <span className="gradient-text">Profile</span></h1>
        </motion.div>

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static flex items-center gap-6 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <HiOutlinePhotograph className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="glass-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="glass-input w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
              <input type="number" name="height" value={form.height} onChange={handleChange} className="glass-input w-full max-w-[200px]" />
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 pt-6">
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Goals</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Target Weight (kg)</label>
                  <input type="number" name="goals.targetWeight" value={form.goals.targetWeight} onChange={handleChange} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Daily Calories</label>
                  <input type="number" name="goals.dailyCalories" value={form.goals.dailyCalories} onChange={handleChange} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Daily Protein (g)</label>
                  <input type="number" name="goals.dailyProtein" value={form.goals.dailyProtein} onChange={handleChange} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Daily Steps</label>
                  <input type="number" name="goals.dailySteps" value={form.goals.dailySteps} onChange={handleChange} className="glass-input w-full" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="notifications" checked={form.notifications} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-focus:ring-2 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable notifications</span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              <HiOutlineSave className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
