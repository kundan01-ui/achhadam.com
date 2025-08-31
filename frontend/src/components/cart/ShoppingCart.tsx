import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  Truck, 
  CreditCard,
  ArrowRight,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Product } from '../ui/ProductCard';

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (items: CartItem[]) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  onCheckout
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Mock cart data - in real app this would come from context/store
  useEffect(() => {
    const mockItems: CartItem[] = [
      {
        product: {
          id: '1',
          name: 'Organic Durum Wheat',
          category: 'grains',
          subcategory: 'Wheat',
          description: 'Premium quality organic durum wheat, perfect for making pasta and bread.',
          price: 45.00,
          unit: 'kg',
          quantity: 500,
          location: 'Punjab',
          harvestDate: '2024-01-10',
          organic: true,
          grade: 'A',
          rating: 4.8,
          reviewCount: 124,
          images: ['/images/wheat1.jpg'],
          tags: ['Organic', 'Premium', 'Durum'],
          certifications: ['Organic India', 'FSSAI'],
          supplier: {
            id: 'supplier1',
            name: 'Rajesh Kumar Farms',
            rating: 4.9,
            verified: true
          }
        },
        quantity: 2,
        addedAt: new Date()
      },
      {
        product: {
          id: '2',
          name: 'Fresh Tomatoes',
          category: 'vegetables',
          subcategory: 'Tomatoes',
          description: 'Fresh, juicy tomatoes harvested from our greenhouse.',
          price: 35.00,
          unit: 'kg',
          quantity: 200,
          location: 'Haryana',
          harvestDate: '2024-01-15',
          organic: false,
          grade: 'A',
          rating: 4.6,
          reviewCount: 89,
          images: ['/images/tomatoes1.jpg'],
          tags: ['Fresh', 'Juicy', 'Greenhouse'],
          certifications: ['FSSAI'],
          supplier: {
            id: 'supplier2',
            name: 'Green Valley Farms',
            rating: 4.7,
            verified: true
          }
        },
        quantity: 1,
        addedAt: new Date()
      }
    ];
    setCartItems(mockItems);
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return getSubtotal() > 1000 ? 0 : 50; // Free shipping above ₹1000
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost();
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      onCheckout(cartItems);
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-primary-green" />
            <h2 className="text-xl font-bold text-text-dark">Shopping Cart</h2>
            {getItemCount() > 0 && (
              <span className="bg-primary-green text-white text-xs px-2 py-1 rounded-full">
                {getItemCount()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-dark mb-2">Your cart is empty</h3>
              <p className="text-text-light mb-4">
                Add some products to get started
              </p>
              <Button variant="outline" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.product.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-neutral-gray rounded-agricultural flex-shrink-0 overflow-hidden">
                        {item.product.images[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-text-dark truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-text-light">
                          {item.product.supplier.name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-text-light">
                            {formatPrice(item.product.price)} per {item.product.unit}
                          </span>
                          <span className="text-sm text-text-light">
                            {item.product.location}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-primary-green">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-error hover:text-red-700 text-sm flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-light">Subtotal ({getItemCount()} items)</span>
                <span className="font-medium">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-light">Shipping</span>
                <span className="font-medium">
                  {getShippingCost() === 0 ? 'Free' : formatPrice(getShippingCost())}
                </span>
              </div>
              {getShippingCost() > 0 && (
                <div className="text-xs text-success">
                  Add ₹{1000 - getSubtotal()} more for free shipping
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-green">{formatPrice(getTotal())}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handleCheckout}
                loading={isCheckingOut}
                disabled={cartItems.length === 0}
              >
                {isCheckingOut ? (
                  <>
                    <Package className="w-5 h-5 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-text-light space-y-1">
              <div className="flex items-center space-x-1">
                <Truck className="w-3 h-3" />
                <span>Free delivery on orders above ₹1000</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-3 h-3" />
                <span>Secure payment with multiple options</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="w-3 h-3" />
                <span>7-day return policy</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;






