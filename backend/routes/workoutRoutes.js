const express = require('express');
const router = express.Router();
const { searchWorkouts, logWorkout, getLogs, deleteLog, getWorkoutSummary } = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchWorkouts);
router.post('/log', protect, logWorkout);
router.get('/logs', protect, getLogs);
router.delete('/log/:id', protect, deleteLog);
router.get('/summary', protect, getWorkoutSummary);

module.exports = router;
