import React from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Star, 
  Tag, 
  Leaf,
  Heart,
  Share2,
  ShoppingCart
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
  onWishlist,
  onShare,
  onView,
  className
}) => {
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
        return 'bg-success text-white';
      case 'B':
        return 'bg-warning text-white';
      case 'C':
        return 'bg-error text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

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
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAddToCart?.(product.id)}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
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
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => onAddToCart?.(product.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onWishlist?.(product.id)}
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onShare?.(product.id)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("hover:shadow-card-hover transition-all duration-300", className)}>
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="aspect-square bg-neutral-gray rounded-agricultural overflow-hidden mb-4">
          {product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-text-dark line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-text-light line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
              <span className="text-sm text-text-light">({product.reviewCount})</span>
            </div>
            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getGradeColor(product.grade))}>
              Grade {product.grade}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-text-light">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span>{product.quantity} {product.unit}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary-green">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-text-light"> per {product.unit}</span>
            </div>
            {product.organic && (
              <span className="flex items-center space-x-1 text-success text-sm">
                <Leaf className="w-4 h-4" />
                <span>Organic</span>
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-green bg-opacity-10 text-primary-green text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{product.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onAddToCart?.(product.id)}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWishlist?.(product.id)}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;



