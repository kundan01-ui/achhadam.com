import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { 
  Package, 
  Camera, 
  MapPin, 
  DollarSign, 
  Scale, 
  Calendar,
  Tag,
  FileText,
  Upload,
  X
} from 'lucide-react';

interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  unit: string;
  quantity: string;
  minOrderQuantity: string;
  location: string;
  harvestDate: string;
  expiryDate: string;
  organic: boolean;
  grade: string;
  images: File[];
  tags: string[];
  certifications: string[];
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    unit: 'kg',
    quantity: '',
    minOrderQuantity: '',
    location: '',
    harvestDate: '',
    expiryDate: '',
    organic: false,
    grade: 'A',
    images: [],
    tags: [],
    certifications: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [newTag, setNewTag] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const categoryOptions: SelectOption[] = [
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'pulses', label: 'Pulses & Legumes' },
    { value: 'spices', label: 'Spices & Herbs' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'fishery', label: 'Fishery Products' },
    { value: 'other', label: 'Other Products' }
  ];

  const unitOptions: SelectOption[] = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'ton', label: 'Ton' },
    { value: 'quintal', label: 'Quintal' },
    { value: 'piece', label: 'Piece' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'litre', label: 'Litre (L)' },
    { value: 'ml', label: 'Millilitre (ml)' }
  ];

  const gradeOptions: SelectOption[] = [
    { value: 'A', label: 'Grade A (Premium)' },
    { value: 'B', label: 'Grade B (Standard)' },
    { value: 'C', label: 'Grade C (Economy)' }
  ];

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, newTag.trim()] 
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        certifications: [...prev.certifications, newCertification.trim()] 
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      certifications: prev.certifications.filter(cert => cert !== certToRemove) 
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-6 h-6 mr-2" />
          {initialData.name ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name *"
              placeholder="e.g., Organic Wheat, Fresh Tomatoes"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              leftIcon={<Package className="w-5 h-5" />}
            />

            <Select
              label="Category *"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors.category}
              placeholder="Select category"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Subcategory"
              placeholder="e.g., Durum Wheat, Cherry Tomatoes"
              value={formData.subcategory}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
            />

            <Input
              label="Location *"
              placeholder="e.g., Punjab, Haryana"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={errors.location}
              leftIcon={<MapPin className="w-5 h-5" />}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Description *
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-agricultural transition-all duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green focus:ring-opacity-20"
              rows={4}
              placeholder="Describe your product, quality, farming methods, etc."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            {errors.description && (
              <p className="text-error text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Pricing & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Price per Unit *"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              error={errors.price}
              leftIcon={<DollarSign className="w-5 h-5" />}
              type="number"
              step="0.01"
              min="0"
            />

            <Select
              label="Unit *"
              options={unitOptions}
              value={formData.unit}
              onChange={(value) => handleInputChange('unit', value)}
              placeholder="Select unit"
            />

            <Input
              label="Available Quantity *"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              error={errors.quantity}
              leftIcon={<Scale className="w-5 h-5" />}
              type="number"
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Minimum Order Quantity"
              placeholder="0"
              value={formData.minOrderQuantity}
              onChange={(e) => handleInputChange('minOrderQuantity', e.target.value)}
              type="number"
              min="0"
            />

            <Select
              label="Grade"
              options={gradeOptions}
              value={formData.grade}
              onChange={(value) => handleInputChange('grade', value)}
              placeholder="Select grade"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Harvest Date *"
              type="date"
              value={formData.harvestDate}
              onChange={(e) => handleInputChange('harvestDate', e.target.value)}
              error={errors.harvestDate}
              leftIcon={<Calendar className="w-5 h-5" />}
            />

            <Input
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
          </div>

          {/* Organic Certification */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="organic"
              checked={formData.organic}
              onChange={(e) => handleInputChange('organic', e.target.checked)}
              className="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
            />
            <label htmlFor="organic" className="text-sm font-medium text-text-dark">
              This is an organic product
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-green bg-opacity-10 text-primary-green"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-green hover:text-secondary-green"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Certifications
            </label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add certification"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                className="flex-1"
              />
              <Button type="button" onClick={addCertification} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-green bg-opacity-10 text-secondary-green"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(cert)}
                    className="ml-2 text-secondary-green hover:text-primary-green"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-agricultural p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-text-light mb-2">
                Upload high-quality images of your product
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="outline" className="cursor-pointer">
                  <Camera className="w-4 h-4 mr-2" />
                  Choose Images
                </Button>
              </label>
            </div>
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-agricultural"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {initialData.name ? 'Update Product' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
