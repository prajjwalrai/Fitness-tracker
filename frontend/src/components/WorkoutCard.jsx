import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const difficultyColors = {
  beginner: 'badge-beginner',
  intermediate: 'badge-intermediate',
  expert: 'badge-expert'
};

const WorkoutCard = ({ exercise, onAdd, onDelete, isLogged = false }) => {
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
            {exercise.exerciseName || exercise.name}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {(exercise.muscle) && (
              <span className="badge-primary text-xs capitalize">{exercise.muscle}</span>
            )}
            {(exercise.difficulty) && (
              <span className={`${difficultyColors[exercise.difficulty] || 'badge-primary'} text-xs capitalize`}>
                {exercise.difficulty}
              </span>
            )}
            {exercise.equipment && exercise.equipment !== 'body_only' && (
              <span className="badge text-xs bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 capitalize">
                {exercise.equipment.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>

        {onAdd && (
          <button
            onClick={() => onAdd(exercise)}
            className="p-2 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-500/20 transition-all"
            title="Log workout"
          >
            <HiOutlinePlus className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(exercise._id)}
            className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            title="Delete"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Details */}
      {isLogged && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {exercise.sets > 0 && <StatItem label="Sets" value={exercise.sets} />}
          {exercise.reps > 0 && <StatItem label="Reps" value={exercise.reps} />}
          {exercise.duration > 0 && <StatItem label="Min" value={exercise.duration} />}
        </div>
      )}

      {exercise.instructions && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
          {exercise.instructions}
        </p>
      )}
    </motion.div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-white/5">
    <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
  </div>
);

export default WorkoutCard;
