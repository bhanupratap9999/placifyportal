const express = require('express');
const router = express.Router();
const {
    getPaymentConfig,
    createOrder,
    verifyPayment,
    getPaymentHistory,
    getAllPayments,
    handleWebhook
} = require('../controllers/paymentController');
const { protect, restrictTo } = require('../middleware/auth');

// Public endpoints
router.get('/config', getPaymentConfig);
router.post('/webhook', handleWebhook);

// Protected routes (Logged in users)
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

// Coordinator/Admin oversight
router.get('/all', protect, restrictTo('company'), getAllPayments);

module.exports = router;
