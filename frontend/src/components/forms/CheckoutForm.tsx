import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Truck, 
  Package,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui';
import { CartItem } from '../cart/ShoppingCart';

interface CheckoutFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Delivery Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  
  // Delivery Options
  deliveryMethod: string;
  deliveryDate: string;
  deliveryTime: string;
  
  // Payment
  paymentMethod: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  
  // Additional
  specialInstructions: string;
  saveAddress: boolean;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  onBack: () => void;
  onComplete: (orderData: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setCheckoutFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    deliveryMethod: 'standard',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    specialInstructions: '',
    saveAddress: false
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryOptions: SelectOption[] = [
    { value: 'standard', label: 'Standard Delivery (2-4 days) - Free' },
    { value: 'express', label: 'Express Delivery (1-2 days) - ₹100' },
    { value: 'same-day', label: 'Same Day Delivery - ₹200' }
  ];

  const timeSlots: SelectOption[] = [
    { value: '09:00-12:00', label: '9:00 AM - 12:00 PM' },
    { value: '12:00-15:00', label: '12:00 PM - 3:00 PM' },
    { value: '15:00-18:00', label: '3:00 PM - 6:00 PM' },
    { value: '18:00-21:00', label: '6:00 PM - 9:00 PM' }
  ];

  const paymentOptions: SelectOption[] = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'netbanking', label: 'Net Banking' },
    { value: 'cod', label: 'Cash on Delivery' }
  ];

  const stateOptions: SelectOption[] = [
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Gujarat', label: 'Gujarat' }
  ];

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setCheckoutFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      
      case 2: // Delivery Address
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        break;
      
      case 3: // Delivery Options
        if (!formData.deliveryMethod) newErrors.deliveryMethod = 'Delivery method is required';
        if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
        if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';
        break;
      
      case 4: // Payment
        if (formData.paymentMethod === 'card') {
          if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
          if (!formData.cardHolder.trim()) newErrors.cardHolder = 'Card holder name is required';
          if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
          if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getDeliveryCost = () => {
    switch (formData.deliveryMethod) {
      case 'express': return 100;
      case 'same-day': return 200;
      default: return 0;
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryCost();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      const orderData = {
        ...formData,
        items: cartItems,
        subtotal: getSubtotal(),
        deliveryCost: getDeliveryCost(),
        total: getTotal(),
        orderDate: new Date().toISOString(),
        orderId: `ORD-${Date.now()}`
      };
      
      onComplete(orderData);
      setIsProcessing(false);
    }, 3000);
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Delivery Address', icon: MapPin },
    { number: 3, title: 'Delivery Options', icon: Truck },
    { number: 4, title: 'Payment', icon: CreditCard }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-dark">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                leftIcon={<User className="w-5 h-5" />}
              />
              <Input
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5" />}
              />
              <Input
                label="Phone Number *"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                leftIcon={<Phone className="w-5 h-5" />}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-dark">Delivery Address</h3>
            
            <Input
              label="Address Line 1 *"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              error={errors.addressLine1}
              leftIcon={<MapPin className="w-5 h-5" />}
            />

            <Input
              label="Address Line 2 (Optional)"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              placeholder="Apartment, suite, etc."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City *"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={errors.city}
              />
              <Select
                label="State *"
                options={stateOptions}
                value={formData.state}
                onChange={(value) => handleInputChange('state', value)}
                error={errors.state}
                placeholder="Select state"
              />
              <Input
                label="Pincode *"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                error={errors.pincode}
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="saveAddress"
                checked={formData.saveAddress}
                onChange={(e) => handleInputChange('saveAddress', e.target.checked)}
                className="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
              />
              <label htmlFor="saveAddress" className="text-sm font-medium text-text-dark">
                Save this address for future orders
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-dark">Delivery Options</h3>
            
            <Select
              label="Delivery Method *"
              options={deliveryOptions}
              value={formData.deliveryMethod}
              onChange={(value) => handleInputChange('deliveryMethod', value)}
              error={errors.deliveryMethod}
              placeholder="Select delivery method"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preferred Delivery Date *"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                error={errors.deliveryDate}
                min={new Date().toISOString().split('T')[0]}
              />
              <Select
                label="Preferred Time Slot *"
                options={timeSlots}
                value={formData.deliveryTime}
                onChange={(value) => handleInputChange('deliveryTime', value)}
                error={errors.deliveryTime}
                placeholder="Select time slot"
              />
            </div>

            <Input
              label="Special Instructions (Optional)"
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              placeholder="Any special delivery instructions..."
              rows={3}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-dark">Payment Information</h3>
            
            <Select
              label="Payment Method *"
              options={paymentOptions}
              value={formData.paymentMethod}
              onChange={(value) => handleInputChange('paymentMethod', value)}
              placeholder="Select payment method"
            />

            {formData.paymentMethod === 'card' && (
              <div className="space-y-4">
                <Input
                  label="Card Number *"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  error={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  leftIcon={<CreditCard className="w-5 h-5" />}
                />

                <Input
                  label="Card Holder Name *"
                  value={formData.cardHolder}
                  onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                  error={errors.cardHolder}
                  placeholder="John Doe"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date *"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    error={errors.expiryDate}
                    placeholder="MM/YY"
                  />
                  <Input
                    label="CVV *"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    error={errors.cvv}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-neutral-gray p-4 rounded-agricultural">
              <h4 className="font-medium text-text-dark mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{getDeliveryCost() === 0 ? 'Free' : formatPrice(getDeliveryCost())}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-primary-green">{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-primary-green border-primary-green text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.number ? 'text-primary-green' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-primary-green' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>

        {/* Navigation */}
        <CardFooter className="flex justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={onBack}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isProcessing}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Package className="w-5 h-5 mr-2 animate-pulse" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    Complete Order
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutForm;






