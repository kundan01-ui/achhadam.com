const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { CropListing } = require('../models');
const auth = require('../middleware/auth');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

/**
 * POST /api/payment/create-order
 * Create Razorpay order and store in database
 */
router.post('/create-order', auth, async (req, res) => {
  try {
    const {
      amount,
      currency = 'INR',
      listingId,
      quantity,
      deliveryType,
      deliveryAddress,
      pickupAddress,
      notes
    } = req.body;

    const buyerId = req.user.userId;

    console.log('💳 PAYMENT: Creating Razorpay order');
    console.log(`💰 Amount: ₹${amount / 100}`);

    // Get listing details
    const listing = await CropListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check quantity availability
    if (listing.quantityAvailable < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${listing.quantityAvailable} ${listing.unit} available`
      });
    }

    // Create order ID
    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency,
      receipt: orderId,
      notes: {
        orderId,
        listingId,
        buyerId,
        farmerId: listing.farmerId.toString()
      }
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    // Create order in database
    const order = new Order({
      orderId,
      buyerId,
      farmerId: listing.farmerId,
      listingId,

      orderDetails: {
        cropName: listing.cropName,
        variety: listing.variety,
        quality: listing.quality,
        quantity,
        unit: listing.unit,
        pricePerUnit: listing.pricePerUnit,
        totalAmount: amount / 100,
        currency
      },

      delivery: {
        type: deliveryType,
        pickupAddress,
        deliveryAddress,
        deliveryCharges: deliveryType === 'delivery' ? 100 : 0,
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      },

      payment: {
        method: 'razorpay',
        status: 'pending',
        amount: amount / 100,
        currency,
        razorpayOrderId: razorpayOrder.id,
        transactionId: null,
        paymentDate: null
      },

      status: {
        current: 'pending',
        history: [{
          status: 'pending',
          timestamp: new Date(),
          note: 'Order created, awaiting payment',
          updatedBy: 'system'
        }]
      }
    });

    await order.save();

    console.log('✅ Order saved to database:', orderId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        listingId,
        orderDetails: order.orderDetails
      }
    });

  } catch (error) {
    console.error('❌ CREATE ORDER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

/**
 * POST /api/payment/verify
 * Verify Razorpay payment signature
 */
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    console.log('🔐 PAYMENT: Verifying payment signature');
    console.log(`📋 Order ID: ${orderId}`);
    console.log(`💳 Payment ID: ${razorpayPaymentId}`);

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.error('❌ Invalid payment signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    console.log('✅ Payment signature verified');

    // Find order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order with payment success
    order.payment.status = 'paid';
    order.payment.transactionId = razorpayPaymentId;
    order.payment.paymentDate = new Date();
    order.status.current = 'confirmed';
    order.status.history.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Payment successful, order confirmed',
      updatedBy: 'system'
    });

    await order.save();

    // Update listing quantity
    await CropListing.findByIdAndUpdate(order.listingId, {
      $inc: {
        quantityAvailable: -order.orderDetails.quantity,
        soldQuantity: order.orderDetails.quantity
      }
    });

    console.log('✅ Order updated with payment details');
    console.log(`📦 Inventory updated: -${order.orderDetails.quantity} ${order.orderDetails.unit}`);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });

  } catch (error) {
    console.error('❌ VERIFY PAYMENT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

module.exports = router;
