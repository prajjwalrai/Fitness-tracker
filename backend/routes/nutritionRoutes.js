const express = require('express');
const router = express.Router();
const { searchNutrition, logNutrition, getLogs, deleteLog, getDailySummary } = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchNutrition);
router.post('/log', protect, logNutrition);
router.get('/logs', protect, getLogs);
router.delete('/log/:id', protect, deleteLog);
router.get('/summary', protect, getDailySummary);

module.exports = router;
