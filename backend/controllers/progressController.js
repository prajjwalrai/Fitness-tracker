const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Add progress entry (weight, bmi)
// @route   POST /api/v1/progress
const addProgress = async (req, res, next) => {
  try {
    const { weight, bodyFat, waist, notes, date } = req.body;

    // Calculate BMI if height is available
    const user = await User.findById(req.user._id);
    const heightInMeters = (user.height || 170) / 100;
    const bmi = weight ? Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10 : 0;

    const entry = await Progress.create({
      user: req.user._id,
      weight,
      bmi,
      bodyFat: bodyFat || 0,
      waist: waist || 0,
      notes: notes || '',
      date: date || Date.now()
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's progress history
// @route   GET /api/v1/progress
const getProgress = async (req, res, next) => {
  try {
    const { limit = 90 } = req.query;
    const entries = await Progress.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress summary (weekly/monthly stats)
// @route   GET /api/v1/progress/summary
const getSummary = async (req, res, next) => {
  try {
    const { period = 'weekly' } = req.query;
    const days = period === 'monthly' ? 30 : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const entries = await Progress.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    let summary = {
      period,
      entries: entries.length,
      startWeight: entries.length > 0 ? entries[0].weight : null,
      endWeight: entries.length > 0 ? entries[entries.length - 1].weight : null,
      weightChange: 0,
      avgBmi: 0,
      latestBmi: entries.length > 0 ? entries[entries.length - 1].bmi : null
    };

    if (entries.length > 0) {
      summary.weightChange = Math.round((summary.endWeight - summary.startWeight) * 10) / 10;
      summary.avgBmi = Math.round((entries.reduce((sum, e) => sum + e.bmi, 0) / entries.length) * 10) / 10;
    }

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a progress entry
// @route   DELETE /api/v1/progress/:id
const deleteProgress = async (req, res, next) => {
  try {
    const entry = await Progress.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    await entry.deleteOne();
    res.json({ success: true, message: 'Progress entry deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addProgress, getProgress, getSummary, deleteProgress };
