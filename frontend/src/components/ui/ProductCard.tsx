import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import {
  Package,
  MapPin,
  Calendar,
  Star,
  Tag,
  Leaf,
  Share2,
  ShoppingCart,
  MessageCircle,
  Zap,
  Phone,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  Award
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
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
  };
}

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onAddToCart?: (productId: string) => void;
  onBuyNow?: (productId: string) => void;
  onChat?: (productId: string, farmerId: string) => void;
  onWishlist?: (productId: string) => void;
  onShare?: (productId: string) => void;
  onView?: (productId: string) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showActions = true,
  onAddToCart,
  onBuyNow,
  onChat,
  onWishlist,
  onShare,
  onView,
  className
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-500 text-white';
      case 'B':
        return 'bg-yellow-500 text-white';
      case 'C':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onWishlist?.(product.id);
  };

  const handleChatClick = () => {
    onChat?.(product.id, product.supplier.id);
  };

  const getDaysFromHarvest = () => {
    const harvestDate = new Date(product.harvestDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - harvestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isNewHarvest = getDaysFromHarvest() <= 3;
  const isFreshHarvest = getDaysFromHarvest() <= 7;

  const getAvailabilityStatus = () => {
    if (product.quantity > 100) return { status: 'High Stock', color: 'text-green-600', bg: 'bg-green-100' };
    if (product.quantity > 20) return { status: 'Available', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Limited Stock', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const availability = getAvailabilityStatus();

  if (variant === 'compact') {
    return (
      <Card className={cn("hover:shadow-card-hover transition-all duration-300", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-neutral-gray rounded-agricultural flex-shrink-0">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-agricultural"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-dark truncate">{product.name}</h3>
              <p className="text-sm text-text-light">{product.supplier.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold text-primary-green">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-text-light">per {product.unit}</span>
              </div>
            </div>
            {showActions && (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onAddToCart?.(product.id)}
                  className="px-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleChatClick}
                  className="px-2"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn("hover:shadow-card-hover transition-all duration-300", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-gray rounded-agricultural overflow-hidden">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-neutral-gray rounded-agricultural overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-text-dark">{product.name}</h1>
                <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getGradeColor(product.grade))}>
                  Grade {product.grade}
                </span>
              </div>
              <p className="text-text-light">{product.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary-green">
                  {formatPrice(product.price)}
                </span>
                <span className="text-text-light">per {product.unit}</span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-text-light">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Harvested {formatDate(product.harvestDate)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-text-light">
                    ({product.rating}/5 • {product.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="w-4 h-4 text-text-light" />
                  <span className="text-sm text-text-light">
                    {product.quantity} {product.unit} available
                  </span>
                </div>
              </div>
            </div>

            {/* Tags and Certifications */}
            <div className="space-y-3">
              {product.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-dark mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-green bg-opacity-10 text-primary-green text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-dark mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary-green bg-opacity-10 text-secondary-green text-xs rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Supplier Info */}
            <div className="p-3 bg-neutral-gray rounded-agricultural">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-dark">{product.supplier.name}</h4>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(product.supplier.rating)}
                    <span className="text-sm text-text-light">
                      ({product.supplier.rating}/5)
                    </span>
                    {product.supplier.verified && (
                      <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="space-y-3">
                {/* Primary Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => onBuyNow?.(product.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Buy
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => onAddToCart?.(product.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleChatClick}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hidden md:flex"
                    title="Chat with Farmer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleChatClick}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 md:hidden"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Farmer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onShare?.(product.id)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Contact Options */}
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `tel:${product.supplier.id}`}
                    className="text-gray-600"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call Farmer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView?.(product.id)}
                    className="text-gray-600"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("hover:shadow-xl transition-all duration-300 border border-gray-100 shadow-sm bg-white relative overflow-hidden h-full flex flex-col", className)}>
      {/* Special Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
        {isNewHarvest && (
          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Fresh
          </span>
        )}
        {product.organic && (
          <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded flex items-center">
            <Leaf className="w-3 h-3 mr-1" />
            Organic
          </span>
        )}
      </div>

      <CardContent className="p-3 flex flex-col h-full">
        {/* Product Image - Reduced height */}
        <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden mb-3 relative group">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = '/images/default-crop.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
              <Package className="w-12 h-12 text-green-300" />
            </div>
          )}

          {/* Verified Badge on Image */}
          {product.supplier.verified && (
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Product Info - Compact and Clean */}
        <div className="flex-1 flex flex-col space-y-2">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-tight">
            {product.name}
          </h3>

          {/* Location and Stock */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{product.location}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${availability.bg} ${availability.color}`}>
              {product.quantity} {product.unit}
            </span>
          </div>

          {/* Price - Large and Prominent */}
          <div className="py-2 border-y border-gray-100">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">/{product.unit}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {renderStars(product.rating).slice(0, 5)}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>
          </div>

          {/* Farmer Info - Compact */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.supplier.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChatClick}
              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons - Prominent and Large */}
          {showActions && (
            <div className="space-y-2 mt-auto pt-2">
              {/* Primary Actions - Large Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onBuyNow?.(product.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 text-sm shadow-sm"
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToCart?.(product.id)}
                  className="flex-1 border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2.5 text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  Add to Cart
                </Button>
              </div>

              {/* Secondary Actions - Compact */}
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChatClick}
                  className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 py-2 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(product.id)}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-3"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare?.(product.id)}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-3"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;



