import React, { useState } from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import {
  ShoppingCart,
  MessageCircle,
  Zap,
  MapPin,
  Calendar,
  Award,
  Star,
  Leaf,
  Clock,
  CheckCircle,
  Package,
  X,
  Camera
} from 'lucide-react';
import { cn } from '../../utils/cn';
import FarmerProfileModal from './FarmerProfileModal';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  quality?: string;
  location: string;
  harvestDate: string;
  organic: boolean;
  grade: string;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  certifications: string[];
  supplier: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    farmName?: string;
    totalCrops?: number;
    joinedDate?: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onBuyNow?: (productId: string) => void;
  onChat?: (productId: string, farmerId: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

const OptimizedProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onChat,
  className,
  variant = 'default'
}) => {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFarmerProfile, setShowFarmerProfile] = useState(false);
  const [showPaymentOption, setShowPaymentOption] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-3 h-3",
          i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        )}
      />
    ));
  };

  const getDaysFromHarvest = () => {
    const harvestDate = new Date(product.harvestDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - harvestDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isNewHarvest = getDaysFromHarvest() <= 3;

  const handleImageClick = () => {
    if (product.images && product.images.length > 0) {
      setShowImageGallery(true);
    }
  };

  const handleChatClick = () => {
    onChat?.(product.id, product.supplier.id);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product.id);
    setShowPaymentOption(true);
    setTimeout(() => setShowPaymentOption(false), 5000);
  };

  const handleContinueToPayment = () => {
    onBuyNow?.(product.id);
    setShowPaymentOption(false);
  };

  // Compact/List view - smaller image
  if (variant === 'compact') {
    return (
      <>
        <Card className={cn(
          "hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white",
          className
        )}>
          <CardContent className="p-3 flex gap-3">
            {/* Smaller Image for list view */}
            <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative">
              {product.images && product.images.length > 0 && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}

              {/* Fallback */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100",
                product.images && product.images.length > 0 && product.images[0] ? "hidden" : ""
              )}>
                <Package className="w-8 h-8 text-green-300" />
              </div>

              {/* Small badges on image */}
              {product.organic && (
                <div className="absolute top-1 left-1 bg-green-600/90 rounded-full p-1">
                  <Leaf className="w-3 h-3 text-white" />
                </div>
              )}
              {product.supplier.verified && (
                <div className="absolute top-1 right-1 bg-blue-600/90 rounded-full p-1">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <h3 className="font-bold text-base text-gray-900">{product.name}</h3>
              {product.subcategory && (
                <p className="text-xs text-gray-600">{product.subcategory}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                <span className="text-xs text-gray-600">/{product.unit}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => onBuyNow?.(product.id)} className="flex-1 bg-green-600">
                  <Zap className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAddToCart?.(product.id)} className="flex-1">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // Default grid view
  return (
    <>
      <Card className={cn(
        "hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-white relative overflow-hidden h-full flex flex-col group",
        className
      )}>
        {/* Compact Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isNewHarvest && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3" />
              Fresh
            </span>
          )}
        </div>

        {/* Camera Icon Badge - ONLY ICON */}
        {product.images && product.images.length > 1 && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm">
              <Camera className="w-4 h-4" />
            </div>
          </div>
        )}

        <CardContent className="p-4 flex flex-col h-full">
          {/* Product Image - Clickable for Gallery */}
          <div
            className="aspect-[5/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-3 relative cursor-pointer"
            onClick={handleImageClick}
          >
            {product.images && product.images.length > 0 && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  console.log('Image failed to load:', product.images[0]);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}

            {/* Fallback */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100",
              product.images && product.images.length > 0 && product.images[0] ? "hidden" : ""
            )}>
              <Package className="w-16 h-16 text-green-300 mb-2" />
              <span className="text-sm text-green-600 font-medium">{product.name}</span>
            </div>

            {/* Symbolic badges on image - smaller and cleaner */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              {product.organic && (
                <div className="bg-green-600/95 backdrop-blur-sm rounded-full p-1.5">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              {product.supplier.verified && (
                <div className="bg-blue-600/95 backdrop-blur-sm rounded-full p-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Gallery hover */}
            {product.images && product.images.length > 1 && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-3 py-1.5 rounded-full text-sm font-semibold text-gray-900">
                  View Gallery
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-2.5">
            {/* Product Name with Variety */}
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1 text-lg leading-tight">
                {product.name}
              </h3>
              {product.subcategory && (
                <p className="text-sm text-green-600 font-medium">{product.subcategory}</p>
              )}
            </div>

            {/* Smart Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <Package className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{product.quantity} {product.unit}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{formatDate(product.harvestDate)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{product.location}</span>
              </div>
              {/* Quality with Grade A/B/C */}
              {product.grade && (
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-yellow-600" />
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded truncate">
                    Grade {product.grade}
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="py-2 border-y border-gray-200 bg-gray-50 rounded -mx-1 px-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-600 font-medium">/{product.unit}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
            </div>

            {/* Real Farmer Info with Avatar - Clickable */}
            <div
              className="flex items-center justify-between py-2 px-2 bg-gradient-to-r from-green-50 to-transparent rounded cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => setShowFarmerProfile(true)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {product.supplier.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {product.supplier.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-600">{product.supplier.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              {/* Chat Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChatClick();
                }}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full flex-shrink-0"
                title="Chat with Farmer"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Action Buttons - Icon Only */}
            <div className="flex gap-2 mt-auto pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onBuyNow?.(product.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 shadow-md hover:shadow-lg transition-shadow"
                title="Buy Now with Razorpay"
              >
                <Zap className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                className="flex-1 border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold py-3"
                title="Add to Cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>

            {/* Continue to Payment Option */}
            {showPaymentOption && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                <p className="text-xs text-blue-900 mb-2 font-medium">Item added to cart!</p>
                <Button
                  size="sm"
                  onClick={handleContinueToPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Continue to Payment →
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery Modal */}
      {showImageGallery && product.images && product.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowImageGallery(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-[60vh] object-contain bg-gray-100"
              />

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    currentImageIndex === index ? "border-green-500 scale-105" : "border-gray-300 opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Farmer Profile Modal */}
      <FarmerProfileModal
        isOpen={showFarmerProfile}
        onClose={() => setShowFarmerProfile(false)}
        farmer={{
          id: product.supplier.id,
          name: product.supplier.name,
          rating: product.supplier.rating,
          verified: product.supplier.verified,
          farmName: product.supplier.farmName,
          location: product.location,
          totalCrops: product.supplier.totalCrops,
          joinedDate: product.supplier.joinedDate
        }}
      />
    </>
  );
};

export default OptimizedProductCard;