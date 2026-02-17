const mongoose = require('mongoose');

const nutritionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  servingSize: { type: String, default: '100g' },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    default: 'snack'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

nutritionLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
