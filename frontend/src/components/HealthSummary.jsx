import { motion } from 'framer-motion';
import { HiOutlineFire, HiOutlineLightningBolt, HiOutlineScale, HiOutlineHeart } from 'react-icons/hi';

const cards = [
  {
    key: 'calories',
    label: 'Calories',
    icon: HiOutlineFire,
    color: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/20',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-500/10',
    getValue: (data) => data?.calories ?? 0,
    unit: 'kcal',
    goal: (user) => user?.goals?.dailyCalories || 2000
  },
  {
    key: 'protein',
    label: 'Protein',
    icon: HiOutlineLightningBolt,
    color: 'from-primary-500 to-indigo-500',
    shadow: 'shadow-primary-500/20',
    bgLight: 'bg-primary-50',
    bgDark: 'dark:bg-primary-500/10',
    getValue: (data) => data?.protein ?? 0,
    unit: 'g',
    goal: (user) => user?.goals?.dailyProtein || 150
  },
  {
    key: 'weight',
    label: 'Weight',
    icon: HiOutlineScale,
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-500/10',
    getValue: (data) => data?.weight ?? '—',
    unit: 'kg',
    goal: (user) => user?.goals?.targetWeight || 70
  },
  {
    key: 'bmi',
    label: 'BMI',
    icon: HiOutlineHeart,
    color: 'from-accent-500 to-emerald-500',
    shadow: 'shadow-accent-500/20',
    bgLight: 'bg-accent-50',
    bgDark: 'dark:bg-accent-500/10',
    getValue: (data) => data?.bmi ?? '—',
    unit: '',
    goal: () => 22.5
  }
];

const HealthSummary = ({ data = {}, user = {} }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const value = card.getValue(data);
        const goal = card.goal(user);
        const progress = typeof value === 'number' && goal ? Math.min((value / goal) * 100, 100) : 0;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-card group cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.bgDark}`}>
                <Icon className={`w-5 h-5 bg-gradient-to-r ${card.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                <Icon className={`w-5 h-5 text-primary-500`} style={{ marginTop: '-20px', opacity: 1 }} />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Goal: {goal}{card.unit}
              </span>
            </div>

            <div className="mb-3">
              <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {typeof value === 'number' ? Math.round(value) : value}
                <span className="text-sm font-normal text-gray-400 ml-1">{card.unit}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</div>
            </div>

            {/* Progress Bar */}
            {typeof value === 'number' && (
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default HealthSummary;
