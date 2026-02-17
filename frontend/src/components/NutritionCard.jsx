import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const NutritionCard = ({ food, onAdd, onDelete, isLogged = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card group !p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {food.foodName || food.label}
          </h4>
          {food.servingSize && (
            <p className="text-xs text-gray-400 mt-0.5">{food.servingSize}</p>
          )}
          {food.mealType && (
            <span className="badge-primary text-xs mt-1 inline-block capitalize">{food.mealType}</span>
          )}
        </div>
        
        {onAdd && (
          <button
            onClick={() => onAdd(food)}
            className="p-2 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-500/20 transition-all"
            title="Add to log"
          >
            <HiOutlinePlus className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(food._id)}
            className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            title="Delete"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Macro bars */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        <MacroItem label="Cal" value={food.calories} color="bg-amber-500" />
        <MacroItem label="Protein" value={food.protein} unit="g" color="bg-primary-500" />
        <MacroItem label="Fat" value={food.fat} unit="g" color="bg-red-400" />
        <MacroItem label="Carbs" value={food.carbs} unit="g" color="bg-accent-500" />
      </div>
    </motion.div>
  );
};

const MacroItem = ({ label, value, unit = '', color }) => (
  <div className="text-center">
    <div className="text-sm font-bold text-gray-900 dark:text-white">
      {Math.round(value || 0)}<span className="text-xs font-normal text-gray-400">{unit}</span>
    </div>
    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
    <div className={`h-1 rounded-full mt-1.5 ${color} opacity-60`} />
  </div>
);

export default NutritionCard;
