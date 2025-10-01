const express = require('express');
const router = express.Router();
const { Cart, Buyer, User } = require('../models');
const auth = require('../middleware/auth');

// Get cart by buyer - PERMANENT DATA LOADING
router.get('/buyer/:buyerId', auth, async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    // Verify buyer owns the cart
    if (req.user.userId !== buyerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    console.log(`🛒 CART LOAD: Loading cart for buyer ${buyerId}`);

    // Try to load cart - prioritize permanent items, fallback to all items
    let cartItems = await Cart.find({
      buyerId,
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true
    })
    .sort({ addedAt: -1 });

    // Fallback: If no permanent items, load all items for this buyer
    if (cartItems.length === 0) {
      console.log(`📦 No permanent cart items found, loading all cart items for buyer`);
      cartItems = await Cart.find({ buyerId }).sort({ addedAt: -1 });
    }

    console.log(`✅ CART LOAD: Found ${cartItems.length} cart items for buyer ${buyerId}`);

    res.json({
      success: true,
      data: cartItems,
      count: cartItems.length,
      message: 'Permanent cart loaded successfully',
      persistence: {
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      }
    });
  } catch (error) {
    console.error('Error fetching permanent buyer cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permanent buyer cart',
      error: error.message
    });
  }
});

// Add item to cart - PERMANENT PERSISTENCE
router.post('/', auth, async (req, res) => {
  try {
    const {
      cropId,
      cropName,
      quantity,
      price,
      farmerId,
      farmerName,
      imageUrl
    } = req.body;

    // Get buyer ID from authenticated user
    const buyerId = req.user.userId;

    // Create new cart item with PERMANENT PERSISTENCE
    const cartItem = new Cart({
      buyerId,
      cropId,
      cropName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      farmerId,
      farmerName,
      imageUrl,
      addedAt: new Date(),
      // PERMANENT PERSISTENCE MARKERS
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true,
      lastUpdated: new Date(),
      // Add buyer association for permanent linking
      buyerAssociation: {
        buyerId: buyerId,
        buyerName: req.body.buyerName || 'Unknown Buyer',
        permanentLink: true
      }
    });

    await cartItem.save();

    console.log(`✅ PERMANENT: Cart item saved to database: ${cartItem.cropName}`);
    console.log(`🌐 This cart item will be available on any device when buyer logs in`);

    res.json({
      success: true,
      data: cartItem,
      message: 'Cart item saved successfully',
      persistence: {
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      }
    });
  } catch (error) {
    console.error('Error saving cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save cart item',
      error: error.message
    });
  }
});

// Update cart item - PERMANENT PERSISTENCE
router.put('/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { 
        quantity: parseInt(quantity),
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    console.log(`✅ PERMANENT: Cart item updated in database: ${cartItem.cropName}`);
    console.log(`🌐 This cart item will be available on any device when buyer logs in`);

    res.json({
      success: true,
      data: cartItem,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
});

// Remove cart item - PERMANENT PERSISTENCE
router.delete('/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await Cart.findByIdAndDelete(cartItemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    console.log(`✅ PERMANENT: Cart item removed from database: ${cartItem.cropName}`);
    console.log(`🌐 This change will be available on any device when buyer logs in`);

    res.json({
      success: true,
      message: 'Cart item removed successfully'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove cart item',
      error: error.message
    });
  }
});

module.exports = router;






