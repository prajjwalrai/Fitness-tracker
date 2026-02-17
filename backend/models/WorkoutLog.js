const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseName: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  muscle: { type: String, default: '' },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert', ''],
    default: ''
  },
  equipment: { type: String, default: 'body_only' },
  type: { type: String, default: '' },
  instructions: { type: String, default: '' },
  sets: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  duration: { type: Number, default: 0 }, // in minutes
  caloriesBurned: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now
  },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

workoutLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
