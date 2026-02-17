const express = require('express');
const router = express.Router();
const { addProgress, getProgress, getSummary, deleteProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addProgress);
router.get('/', protect, getProgress);
router.get('/summary', protect, getSummary);
router.delete('/:id', protect, deleteProgress);

module.exports = router;
