// Cart Management Service - Enhanced E-commerce Cart
import { authenticatedFetch } from './tokenService';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  maxQuantity: number;
  farmerId: string;
  farmerName: string;
  location: string;
  image: string;
  organic: boolean;
  grade: string;
  harvestDate: string;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  lastUpdated: string;
}

const CART_STORAGE_KEY = 'achhadam_shopping_cart';
const CART_EXPIRY_DAYS = 7;

// Initialize empty cart
const createEmptyCart = (): Cart => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  lastUpdated: new Date().toISOString()
});

// Load cart from localStorage
export const loadCart = (): Cart => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) {
      return createEmptyCart();
    }

    const cart: Cart = JSON.parse(cartData);

    // Check if cart is expired
    const cartAge = Date.now() - new Date(cart.lastUpdated).getTime();
    const maxAge = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (cartAge > maxAge) {
      console.log('🛒 Cart expired, creating fresh cart');
      localStorage.removeItem(CART_STORAGE_KEY);
      return createEmptyCart();
    }

    console.log(`🛒 Loaded cart with ${cart.totalItems} items`);
    return cart;
  } catch (error) {
    console.error('❌ Error loading cart:', error);
    return createEmptyCart();
  }
};

// Save cart to localStorage
const saveCart = (cart: Cart): void => {
  try {
    cart.lastUpdated = new Date().toISOString();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    // Also sync to backend if user is logged in
    syncCartToBackend(cart);

    console.log(`✅ Cart saved with ${cart.totalItems} items`);
  } catch (error) {
    console.error('❌ Error saving cart:', error);
  }
};

// Calculate cart totals
const calculateTotals = (items: CartItem[]): { totalItems: number; totalAmount: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

// Add item to cart
export const addToCart = (product: any, quantity: number = 1): Cart => {
  try {
    console.log('🛒 Adding to cart:', { productId: product.id, quantity });

    const cart = loadCart();
    const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Check if exceeds max quantity
      if (newQuantity > product.quantity) {
        throw new Error(`Cannot add more than ${product.quantity} ${product.unit} available`);
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      console.log(`🛒 Updated quantity for ${product.name}: ${newQuantity}`);
    } else {
      // Add new item
      const cartItem: CartItem = {
        id: `cart_${Date.now()}_${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        unit: product.unit,
        maxQuantity: product.quantity,
        farmerId: product.supplier.id,
        farmerName: product.supplier.name,
        location: product.location,
        image: product.images[0] || '/images/default-crop.jpg',
        organic: product.organic,
        grade: product.grade,
        harvestDate: product.harvestDate,
        addedAt: new Date().toISOString()
      };

      cart.items.push(cartItem);
      console.log(`🛒 Added new item: ${product.name}`);
    }

    // Recalculate totals
    const totals = calculateTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalAmount = totals.totalAmount;

    saveCart(cart);

    // Show success notification
    showCartNotification(`✅ ${product.name} added to cart`, 'success');

    return cart;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    showCartNotification(`❌ ${error.message}`, 'error');
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = (productId: string): Cart => {
  try {
    console.log('🛒 Removing from cart:', productId);

    const cart = loadCart();
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
      const removedItem = cart.items[itemIndex];
      cart.items.splice(itemIndex, 1);

      // Recalculate totals
      const totals = calculateTotals(cart.items);
      cart.totalItems = totals.totalItems;
      cart.totalAmount = totals.totalAmount;

      saveCart(cart);

      showCartNotification(`🗑️ ${removedItem.name} removed from cart`, 'info');
      console.log(`🛒 Removed: ${removedItem.name}`);
    }

    return cart;
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    showCartNotification('❌ Failed to remove item', 'error');
    throw error;
  }
};

// Update item quantity
export const updateCartItemQuantity = (productId: string, quantity: number): Cart => {
  try {
    console.log('🛒 Updating quantity:', { productId, quantity });

    const cart = loadCart();
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
      const item = cart.items[itemIndex];

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return removeFromCart(productId);
      }

      if (quantity > item.maxQuantity) {
        throw new Error(`Cannot add more than ${item.maxQuantity} ${item.unit} available`);
      }

      cart.items[itemIndex].quantity = quantity;

      // Recalculate totals
      const totals = calculateTotals(cart.items);
      cart.totalItems = totals.totalItems;
      cart.totalAmount = totals.totalAmount;

      saveCart(cart);

      console.log(`🛒 Updated quantity for ${item.name}: ${quantity}`);
    }

    return cart;
  } catch (error) {
    console.error('❌ Error updating cart quantity:', error);
    showCartNotification(`❌ ${error.message}`, 'error');
    throw error;
  }
};

// Clear entire cart
export const clearCart = (): Cart => {
  try {
    console.log('🛒 Clearing cart');

    const cart = createEmptyCart();
    saveCart(cart);

    showCartNotification('🧹 Cart cleared', 'info');

    return cart;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    throw error;
  }
};

// Get cart item count
export const getCartItemCount = (): number => {
  const cart = loadCart();
  return cart.totalItems;
};

// Get cart total amount
export const getCartTotal = (): number => {
  const cart = loadCart();
  return cart.totalAmount;
};

// Check if product is in cart
export const isInCart = (productId: string): boolean => {
  const cart = loadCart();
  return cart.items.some(item => item.productId === productId);
};

// Get cart item by product ID
export const getCartItem = (productId: string): CartItem | null => {
  const cart = loadCart();
  return cart.items.find(item => item.productId === productId) || null;
};

// Sync cart to backend (for logged-in users)
const syncCartToBackend = async (cart: Cart): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return; // Skip sync if not logged in

    await authenticatedFetch('http://localhost:5000/api/cart/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cart)
    });

    console.log('✅ Cart synced to backend');
  } catch (error) {
    console.warn('⚠️ Failed to sync cart to backend:', error);
  }
};

// Load cart from backend (for logged-in users)
export const loadCartFromBackend = async (): Promise<Cart> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return loadCart(); // Fall back to local cart
    }

    const response = await authenticatedFetch('http://localhost:5000/api/cart', {
      method: 'GET'
    });

    if (response.ok) {
      const result = await response.json();
      const backendCart = result.data;

      // Merge with local cart (local cart takes precedence for newer items)
      const localCart = loadCart();
      const mergedCart = mergeCart(localCart, backendCart);

      saveCart(mergedCart);
      console.log('✅ Cart loaded and merged from backend');

      return mergedCart;
    }

    return loadCart();
  } catch (error) {
    console.warn('⚠️ Failed to load cart from backend:', error);
    return loadCart();
  }
};

// Merge local and backend cart
const mergeCart = (localCart: Cart, backendCart: Cart): Cart => {
  const mergedItems: CartItem[] = [...localCart.items];

  // Add items from backend that don't exist locally
  backendCart.items.forEach(backendItem => {
    const existsLocally = localCart.items.some(localItem =>
      localItem.productId === backendItem.productId
    );

    if (!existsLocally) {
      mergedItems.push(backendItem);
    }
  });

  const totals = calculateTotals(mergedItems);

  return {
    items: mergedItems,
    totalItems: totals.totalItems,
    totalAmount: totals.totalAmount,
    lastUpdated: new Date().toISOString()
  };
};

// Show cart notification
const showCartNotification = (message: string, type: 'success' | 'error' | 'info') => {
  // Create a simple notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

  switch (type) {
    case 'success':
      notification.className += ' bg-green-500 text-white';
      break;
    case 'error':
      notification.className += ' bg-red-500 text-white';
      break;
    case 'info':
      notification.className += ' bg-blue-500 text-white';
      break;
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

// Cart event listeners
let cartListeners: Array<(cart: Cart) => void> = [];

export const subscribeToCartChanges = (listener: (cart: Cart) => void) => {
  cartListeners.push(listener);

  // Return unsubscribe function
  return () => {
    cartListeners = cartListeners.filter(l => l !== listener);
  };
};

// Notify all listeners of cart changes
const notifyCartListeners = (cart: Cart) => {
  cartListeners.forEach(listener => {
    try {
      listener(cart);
    } catch (error) {
      console.error('❌ Error in cart listener:', error);
    }
  });
};

// Enhanced add to cart with notifications
export const addToCartWithNotification = (product: any, quantity: number = 1): Cart => {
  const cart = addToCart(product, quantity);
  notifyCartListeners(cart);
  return cart;
};

// Buy Now - Direct checkout
export const buyNow = (product: any, quantity: number = 1): void => {
  try {
    console.log('⚡ Buy Now:', { productId: product.id, quantity });

    // Clear cart and add single item
    const cart = createEmptyCart();

    const cartItem: CartItem = {
      id: `buynow_${Date.now()}_${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      unit: product.unit,
      maxQuantity: product.quantity,
      farmerId: product.supplier.id,
      farmerName: product.supplier.name,
      location: product.location,
      image: product.images[0] || '/images/default-crop.jpg',
      organic: product.organic,
      grade: product.grade,
      harvestDate: product.harvestDate,
      addedAt: new Date().toISOString()
    };

    cart.items = [cartItem];
    const totals = calculateTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalAmount = totals.totalAmount;

    // Save as temporary cart for buy now
    localStorage.setItem('achhadam_buynow_cart', JSON.stringify(cart));

    showCartNotification('⚡ Proceeding to checkout...', 'success');

    // Navigate to checkout (this would be handled by the component)
    window.location.href = '/checkout?mode=buynow';

  } catch (error) {
    console.error('❌ Error in Buy Now:', error);
    showCartNotification(`❌ ${error.message}`, 'error');
    throw error;
  }
};

export default {
  loadCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getCartItemCount,
  getCartTotal,
  isInCart,
  getCartItem,
  addToCartWithNotification,
  buyNow,
  subscribeToCartChanges,
  loadCartFromBackend
};