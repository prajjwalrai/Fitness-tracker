const WorkoutLog = require('../models/WorkoutLog');
const { searchExercises } = require('../utils/apiNinjas');

// @desc    Search exercises via API Ninjas
// @route   GET /api/v1/workouts/search?muscle=chest&difficulty=beginner
const searchWorkouts = async (req, res, next) => {
  try {
    const { muscle, difficulty, type, offset } = req.query;
    const results = await searchExercises({ muscle, difficulty, type, offset });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a workout
// @route   POST /api/v1/workouts/log
const logWorkout = async (req, res, next) => {
  try {
    const entry = await WorkoutLog.create({
      user: req.user._id,
      ...req.body
    });
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's workout logs
// @route   GET /api/v1/workouts/logs
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

    const logs = await WorkoutLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workout log
// @route   DELETE /api/v1/workouts/log/:id
const deleteLog = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }
    await log.deleteOne();
    res.json({ success: true, message: 'Workout log deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workout summary
// @route   GET /api/v1/workouts/summary
const getWorkoutSummary = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const summary = await WorkoutLog.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalDuration: { $sum: '$duration' },
          totalCaloriesBurned: { $sum: '$caloriesBurned' },
          workoutCount: { $sum: 1 },
          muscles: { $addToSet: '$muscle' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchWorkouts, logWorkout, getLogs, deleteLog, getWorkoutSummary };
