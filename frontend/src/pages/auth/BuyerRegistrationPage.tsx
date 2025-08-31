import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select, SelectOption } from '../../components/ui';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User
} from 'lucide-react';

interface FormData {
  // Step 1: Business Information
  businessName: string;
  businessType: string;
  gstNumber: string;
  panNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  pincode: string;
  
  // Step 2: Contact & Requirements
  contactPerson: string;
  phone: string;
  email: string;
  businessPhone: string;
  website: string;
  purchaseVolume: string;
  preferredCrops: string[];
  
  // Step 3: Verification & Terms
  businessLicense: string;
  bankAccount: string;
  ifscCode: string;
  termsAccepted: boolean;
}

const BuyerRegistrationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    phone: '',
    email: '',
    businessPhone: '',
    website: '',
    purchaseVolume: '',
    preferredCrops: [],
    businessLicense: '',
    bankAccount: '',
    ifscCode: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.gstNumber) newErrors.gstNumber = 'GST number is required';
      if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
      if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    }

    if (step === 2) {
      if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.purchaseVolume) newErrors.purchaseVolume = 'Purchase volume is required';
      if (formData.preferredCrops.length === 0) newErrors.preferredCrops = 'At least one preferred crop is required';
    }

    if (step === 3) {
      if (!formData.businessLicense) newErrors.businessLicense = 'Business license is required';
      if (!formData.bankAccount) newErrors.bankAccount = 'Bank account is required';
      if (!formData.ifscCode) newErrors.ifscCode = 'IFSC code is required';
      if (!formData.termsAccepted) newErrors.termsAccepted = 'Terms must be accepted';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      console.log('Buyer registration submitted:', formData);
      // Handle registration logic here
    }
  };

  const steps = [
    { number: 1, title: 'Business Information', icon: Building2 },
    { number: 2, title: 'Contact & Requirements', icon: ShoppingCart },
    { number: 3, title: 'Verification & Terms', icon: FileText }
  ];

  const businessTypeOptions: SelectOption[] = [
    { value: 'retailer', label: 'Retailer' },
    { value: 'wholesaler', label: 'Wholesaler' },
    { value: 'processor', label: 'Processor' },
    { value: 'exporter', label: 'Exporter' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'other', label: 'Other' }
  ];

  const cropOptions: SelectOption[] = [
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'maize', label: 'Maize' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'spices', label: 'Spices' },
    { value: 'dairy', label: 'Dairy Products' }
  ];

  const volumeOptions: SelectOption[] = [
    { value: 'small', label: 'Small (0-1000 kg/month)' },
    { value: 'medium', label: 'Medium (1000-10000 kg/month)' },
    { value: 'large', label: 'Large (10000+ kg/month)' },
    { value: 'bulk', label: 'Bulk (100+ tons/month)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-orange via-warm-brown to-primary-green py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join as a Buyer</h1>
          <p className="text-white text-lg opacity-90">Connect with quality farmers and source fresh produce</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-success border-success text-white' 
                      : isCurrent 
                        ? 'bg-white border-white text-primary-green' 
                        : 'bg-white bg-opacity-20 border-white border-opacity-30 text-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 transition-all duration-300 ${
                      isCompleted ? 'bg-success' : 'bg-white bg-opacity-30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-16">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`text-center transition-all duration-300 ${
                  currentStep === step.number 
                    ? 'text-white' 
                    : 'text-white opacity-60'
                }`}
              >
                <p className="font-medium">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-text-dark">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Input
                    label="Business Name"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    leftIcon={<Building2 className="w-5 h-5" />}
                    error={errors.businessName}
                    required
                  />

                  <Select
                    label="Business Type"
                    options={businessTypeOptions}
                    value={formData.businessType}
                    onChange={(value) => handleInputChange('businessType', value)}
                    error={errors.businessType}
                    required
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="GST Number"
                      placeholder="Enter GST number"
                      value={formData.gstNumber}
                      onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                      error={errors.gstNumber}
                      required
                    />
                    <Input
                      label="PAN Number"
                      placeholder="Enter PAN number"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value)}
                      error={errors.panNumber}
                      required
                    />
                  </div>

                  <Input
                    label="Business Address"
                    placeholder="Enter your business address"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    leftIcon={<MapPin className="w-5 h-5" />}
                    error={errors.businessAddress}
                    required
                  />

                  <div className="grid md:grid-cols-3 gap-6">
                    <Input
                      label="City"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      error={errors.city}
                      required
                    />
                    <Input
                      label="State"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      error={errors.state}
                      required
                    />
                    <Input
                      label="Pincode"
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      error={errors.pincode}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Requirements */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Input
                    label="Contact Person Name"
                    placeholder="Enter contact person name"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.contactPerson}
                    required
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      leftIcon={<Phone className="w-5 h-5" />}
                      error={errors.phone}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      leftIcon={<Mail className="w-5 h-5" />}
                      error={errors.email}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Business Phone"
                      type="tel"
                      placeholder="Enter business phone number"
                      value={formData.businessPhone}
                      onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                      leftIcon={<Phone className="w-5 h-5" />}
                    />
                    <Input
                      label="Website (Optional)"
                      type="url"
                      placeholder="Enter website URL"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>

                  <Select
                    label="Monthly Purchase Volume"
                    options={volumeOptions}
                    value={formData.purchaseVolume}
                    onChange={(value) => handleInputChange('purchaseVolume', value)}
                    error={errors.purchaseVolume}
                    required
                  />

                  <Select
                    label="Preferred Crops/Products"
                    options={cropOptions}
                    value={formData.preferredCrops.join(',')}
                    onChange={(value) => handleInputChange('preferredCrops', value.split(',').filter(Boolean))}
                    multiple
                    searchable
                    error={errors.preferredCrops}
                    required
                  />
                </div>
              )}

              {/* Step 3: Verification & Terms */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Input
                    label="Business License Number"
                    placeholder="Enter business license number"
                    value={formData.businessLicense}
                    onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                    error={errors.businessLicense}
                    required
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Bank Account Number"
                      placeholder="Enter bank account number"
                      value={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                      error={errors.bankAccount}
                      required
                    />
                    <Input
                      label="IFSC Code"
                      placeholder="Enter IFSC code"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      error={errors.ifscCode}
                      required
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-agricultural p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-text-light mb-2">Upload Business Documents</p>
                    <p className="text-sm text-text-light">Business License, GST Certificate, PAN Card, Bank Passbook</p>
                  </div>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                      className="w-5 h-5 text-primary-green border-gray-300 rounded focus:ring-primary-green mt-1"
                    />
                    <div className="text-sm text-text-dark">
                      <p>I agree to the <span className="text-primary-green hover:text-secondary-green cursor-pointer">Terms and Conditions</span> and <span className="text-primary-green hover:text-secondary-green cursor-pointer">Privacy Policy</span></p>
                      {errors.termsAccepted && (
                        <p className="text-error text-sm mt-1">{errors.termsAccepted}</p>
                      )}
                    </div>
                  </label>
                </div>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-between pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  size="lg"
                >
                  Complete Registration
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BuyerRegistrationPage;



