const NutritionLog = require('../models/NutritionLog');
const { searchFood } = require('../utils/apiNutrition');

// @desc    Search food via Edamam API
// @route   GET /api/v1/nutrition/search?query=chicken
const searchNutrition = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }
    const results = await searchFood(query);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a nutrition entry
// @route   POST /api/v1/nutrition/log
const logNutrition = async (req, res, next) => {
  try {
    const entry = await NutritionLog.create({
      user: req.user._id,
      ...req.body
    });

    const note = `Added ${req.body.servingSize || '1 serving'} ${req.body.foodName} — ${req.body.calories} kcal, ${req.body.protein}g protein`;

    res.status(201).json({ success: true, data: entry, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's nutrition logs
// @route   GET /api/v1/nutrition/logs
const getLogs = async (req, res, next) => {
  try {
    const { date, startDate, endDate, limit = 50 } = req.query;
    const query = { user: req.user._id };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const logs = await NutritionLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    // Calculate totals
    const totals = logs.reduce((acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      fat: acc.fat + log.fat,
      carbs: acc.carbs + log.carbs
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    res.json({ success: true, count: logs.length, totals, data: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a nutrition log
// @route   DELETE /api/v1/nutrition/log/:id
const deleteLog = async (req, res, next) => {
  try {
    const log = await NutritionLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }
    await log.deleteOne();
    res.json({ success: true, message: 'Log deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily summary for date range
// @route   GET /api/v1/nutrition/summary
const getDailySummary = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const summary = await NutritionLog.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalFat: { $sum: '$fat' },
          totalCarbs: { $sum: '$carbs' },
          mealCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchNutrition, logNutrition, getLogs, deleteLog, getDailySummary };
