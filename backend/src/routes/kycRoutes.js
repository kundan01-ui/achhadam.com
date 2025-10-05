const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');
const { protect } = require('../middleware/auth');

// Farmer routes
router.post('/farmer', protect, kycController.submitFarmerKYC);
router.get('/farmer/:farmerId', protect, kycController.getFarmerKYC);

// Admin routes
router.get('/pending', protect, kycController.getPendingKYC);
router.put('/:kycId/status', protect, kycController.updateKYCStatus);
router.delete('/:kycId', protect, kycController.deleteKYC);

module.exports = router;
