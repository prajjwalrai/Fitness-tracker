import { motion } from 'framer-motion';
import { HiOutlineMicrophone, HiOutlineStop } from 'react-icons/hi';
import useVoiceLog from '../hooks/useVoiceLog';

const VoiceLogButton = ({ onResult }) => {
  const { isListening, transcript, parsedFood, supported, startListening, stopListening } = useVoiceLog();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Pass parsed food to parent when ready
  if (parsedFood && onResult) {
    onResult(parsedFood);
  }

  if (!supported) {
    return null;
  }

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.95 }}
        className={`relative p-3 rounded-xl transition-all duration-300 ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
            : 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20'
        }`}
        title={isListening ? 'Stop listening' : 'Voice log — say "log 200g chicken"'}
      >
        {/* Pulse ring when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-xl bg-red-500"
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-xl bg-red-500"
              animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
        <span className="relative z-10">
          {isListening ? <HiOutlineStop className="w-5 h-5" /> : <HiOutlineMicrophone className="w-5 h-5" />}
        </span>
      </motion.button>

      {/* Transcript bubble */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-3 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400"
        >
          {transcript || 'Listening...'}
        </motion.div>
      )}
    </div>
  );
};

export default VoiceLogButton;
