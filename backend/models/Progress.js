const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required']
  },
  bmi: { type: Number, default: 0 },
  bodyFat: { type: Number, default: 0 },
  waist: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now
  },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

progressSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
