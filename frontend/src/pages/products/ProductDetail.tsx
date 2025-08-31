import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Package, 
  Leaf, 
  CheckCircle,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  Users,
  ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import ProductCard, { Product } from '../../components/ui/ProductCard';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId = '1' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock data - in real app this would come from API
  const product: Product = {
    id: '1',
    name: 'Organic Durum Wheat',
    category: 'grains',
    subcategory: 'Wheat',
    description: 'Premium quality organic durum wheat, perfect for making pasta and bread. Grown without pesticides using traditional farming methods. This wheat is harvested at peak ripeness to ensure maximum nutritional value and flavor. Our organic certification guarantees that no synthetic pesticides or fertilizers were used in the growing process.',
    price: 45.00,
    unit: 'kg',
    quantity: 500,
    location: 'Punjab',
    harvestDate: '2024-01-10',
    organic: true,
    grade: 'A',
    rating: 4.8,
    reviewCount: 124,
    images: [
      '/images/wheat1.jpg',
      '/images/wheat2.jpg',
      '/images/wheat3.jpg',
      '/images/wheat4.jpg'
    ],
    tags: ['Organic', 'Premium', 'Durum', 'Traditional', 'Nutritious'],
    certifications: ['Organic India', 'FSSAI', 'ISO 22000'],
    supplier: {
      id: 'supplier1',
      name: 'Rajesh Kumar Farms',
      rating: 4.9,
      verified: true
    }
  };

  // Related products mock data
  const relatedProducts: Product[] = [
    {
      id: '2',
      name: 'Basmati Rice',
      category: 'grains',
      subcategory: 'Rice',
      description: 'Aromatic basmati rice with long grains.',
      price: 120.00,
      unit: 'kg',
      quantity: 300,
      location: 'UP',
      harvestDate: '2024-01-08',
      organic: true,
      grade: 'A',
      rating: 4.9,
      reviewCount: 156,
      images: ['/images/rice1.jpg'],
      tags: ['Aromatic', 'Long Grain'],
      certifications: ['Organic India', 'FSSAI'],
      supplier: {
        id: 'supplier3',
        name: 'Fresh Harvest Co.',
        rating: 4.8,
        verified: true
      }
    },
    {
      id: '3',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      subcategory: 'Tomatoes',
      description: 'Fresh, juicy tomatoes harvested from greenhouse.',
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
      tags: ['Fresh', 'Juicy'],
      certifications: ['FSSAI'],
      supplier: {
        id: 'supplier2',
        name: 'Green Valley Farms',
        rating: 4.7,
        verified: true
      }
    }
  ];

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
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', { productId: product.id, quantity });
    // Implement cart functionality
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled:', !isWishlisted);
  };

  const handleShare = () => {
    console.log('Sharing product:', product.id);
    // Implement share functionality
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <DashboardLayout
      role="buyer"
      userName="Amit Sharma"
      userAvatar=""
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div className="text-sm text-text-light">
          <span className="capitalize">{product.category}</span>
          {product.subcategory && (
            <>
              <span className="mx-2">•</span>
              <span>{product.subcategory}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Main Image */}
              <div className="aspect-square bg-neutral-gray rounded-agricultural overflow-hidden mb-4">
                {product.images[selectedImage] && (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-neutral-gray rounded-agricultural overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-primary-green' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-text-dark mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                      <span className="text-sm text-text-light">
                        {product.rating}/5 ({product.reviewCount} reviews)
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-success text-white text-xs rounded-full font-medium">
                      Grade {product.grade}
                    </span>
                  </div>
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

                  <div className="flex items-center space-x-4 text-sm text-text-light">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{product.quantity} {product.unit} available</span>
                    </div>
                    {product.organic && (
                      <div className="flex items-center space-x-1 text-success">
                        <Leaf className="w-4 h-4" />
                        <span>Organic</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number(e.target.value))}
                      min={1}
                      max={product.quantity}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </Button>
                    <span className="text-sm text-text-light">
                      {product.unit}
                    </span>
                  </div>
                </div>

                {/* Total Price */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-text-dark">Total Price:</span>
                    <span className="text-2xl font-bold text-primary-green">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleWishlist}
                      className={isWishlisted ? 'text-error border-error' : ''}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                      {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleShare}
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text-dark">{product.supplier.name}</h3>
                  {product.supplier.verified && (
                    <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {renderStars(product.supplier.rating)}
                  <span className="text-sm text-text-light">
                    ({product.supplier.rating}/5)
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-text-light">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4" />
                    <span>15 products</span>
                  </div>
                </div>

                <Button variant="outline" fullWidth>
                  View Supplier Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-light">Estimated Delivery:</span>
                  <span className="font-medium text-text-dark">2-4 business days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-light">Shipping Cost:</span>
                  <span className="font-medium text-text-dark">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-light">Return Policy:</span>
                  <span className="font-medium text-text-dark">7 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-text-dark leading-relaxed">{product.description}</p>
            
            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-text-dark mb-3">Product Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-green bg-opacity-10 text-primary-green text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {product.certifications.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-text-dark mb-3">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary-green bg-opacity-10 text-secondary-green text-sm rounded-full flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Related Products</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  variant="default"
                  showActions={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetail;



