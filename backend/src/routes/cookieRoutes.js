const express = require('express');
const router = express.Router();
const cookieController = require('../controllers/cookieController');

/**
 * @route   POST /api/cookies/preferences
 * @desc    Save user's cookie preferences
 * @access  Public
 */
router.post('/preferences', cookieController.savePreferences);

/**
 * @route   GET /api/cookies/preferences
 * @desc    Get user's cookie preferences
 * @access  Public
 */
router.get('/preferences', cookieController.getPreferences);

module.exports = router;



