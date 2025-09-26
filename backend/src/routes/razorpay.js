const express = require('express');
const razorpayService = require('../services/razorpayService');

const router = express.Router();

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    if (!amount || !currency || !receipt) {
      return res.status(400).json({
        success: false,
        message: 'Amount, currency, and receipt are required'
      });
    }

    const order = await razorpayService.createOrder({
      amount,
      currency,
      receipt,
      notes
    });

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification data is required'
      });
    }

    const verification = await razorpayService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    res.json({
      success: true,
      verification
    });
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// Create Payment Link (UPI/QR Code)
router.post('/create-payment-link', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    if (!amount || !currency || !receipt) {
      return res.status(400).json({
        success: false,
        message: 'Amount, currency, and receipt are required'
      });
    }

    const paymentLink = await razorpayService.createPaymentLink({
      amount,
      currency,
      receipt,
      notes
    });

    res.json({
      success: true,
      paymentLink
    });
  } catch (error) {
    console.error('❌ Error creating payment link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment link',
      error: error.message
    });
  }
});

// Get Payment Details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpayService.getPaymentDetails(paymentId);
    
    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('❌ Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
});

// Get Order Details
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await razorpayService.getOrderDetails(orderId);
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
});

module.exports = router;





