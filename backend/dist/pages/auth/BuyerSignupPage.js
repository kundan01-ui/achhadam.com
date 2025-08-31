"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Button_1 = require("../../components/ui/Button");
const Input_1 = require("../../components/ui/Input");
const Card_1 = require("../../components/ui/Card");
const LanguageSelector_1 = __importDefault(require("../../components/ui/LanguageSelector"));
const LanguageContext_1 = require("../../contexts/LanguageContext");
const BuyerSignupPage = () => {
    const { t } = (0, LanguageContext_1.useLanguage)();
    const [step, setStep] = (0, react_1.useState)(1);
    const [formData, setFormData] = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        businessType: 'individual',
        gstNumber: '',
        preferredCrops: [],
        city: '',
        state: '',
        district: '',
        paymentTerms: '7'
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Buyer signup:', formData);
        setTimeout(() => {
            setIsLoading(false);
            if (step < 3) {
                setStep(step + 1);
            }
        }, 2000);
    };
    const renderStep1 = () => (<div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🏪</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          खरीदार के रूप में खाता बनाएं
        </h2>
        <p className="text-gray-600 text-sm">
          सिर्फ कुछ बुनियादी जानकारी दें
        </p>
      </div>

      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            पहला नाम *
          </label>
          <Input_1.Input placeholder="पहला नाम" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            अंतिम नाम *
          </label>
          <Input_1.Input placeholder="अंतिम नाम" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required/>
        </div>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          मोबाइल नंबर *
        </label>
        <Input_1.Input type="tel" placeholder="10 अंकों का मोबाइल नंबर" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} maxLength={10} required className="text-center text-lg"/>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          ईमेल (वैकल्पिक)
        </label>
        <Input_1.Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}/>
        <p className="text-xs text-gray-500">
          बिल और रसीदें ईमेल पर भेजी जाएंगी
        </p>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          पासवर्ड *
        </label>
        <Input_1.Input type="password" placeholder="कम से कम 6 अक्षर" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} minLength={6} required/>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          पासवर्ड दोबारा लिखें *
        </label>
        <Input_1.Input type="password" placeholder="पासवर्ड दोबारा लिखें" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} required/>
      </div>

      
      <div className="flex items-start space-x-2">
        <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 text-blue-600"/>
        <label htmlFor="terms" className="text-sm text-gray-600">
          मैं <span className="text-blue-600 underline">नियम और शर्तों</span> से सहमत हूं
        </label>
      </div>
    </div>);
    const renderStep2 = () => (<div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          व्यवसाय की जानकारी (वैकल्पिक)
        </h2>
        <p className="text-gray-600 text-sm">
          अभी छोड़ सकते हैं, बाद में भर सकते हैं
        </p>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          व्यवसाय का नाम
        </label>
        <Input_1.Input placeholder="कंपनी या दुकान का नाम" value={formData.businessName} onChange={(e) => handleInputChange('businessName', e.target.value)}/>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          व्यवसाय का प्रकार
        </label>
        <select value={formData.businessType} onChange={(e) => handleInputChange('businessType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="individual">व्यक्तिगत</option>
          <option value="partnership">साझेदारी</option>
          <option value="private_limited">प्राइवेट लिमिटेड</option>
          <option value="public_limited">पब्लिक लिमिटेड</option>
          <option value="cooperative">सहकारी समिति</option>
          <option value="government">सरकारी</option>
        </select>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          GST नंबर (वैकल्पिक)
        </label>
        <Input_1.Input placeholder="GST नंबर" value={formData.gstNumber} onChange={(e) => handleInputChange('gstNumber', e.target.value)}/>
        <p className="text-xs text-gray-500">
          GST नंबर से बेहतर डील्स मिलेंगी
        </p>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          पसंदीदा फसलें
        </label>
        <Input_1.Input placeholder="जैसे: गेहूं, धान, मक्का (कॉमा से अलग करें)" value={formData.preferredCrops.join(', ')} onChange={(e) => handleInputChange('preferredCrops', e.target.value.split(',').map(crop => crop.trim()))}/>
      </div>
    </div>);
    const renderStep3 = () => (<div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          स्थान और प्राथमिकताएं (वैकल्पिक)
        </h2>
        <p className="text-gray-600 text-sm">
          बेहतर सेवा के लिए जानकारी दें
        </p>
      </div>

      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            शहर
          </label>
          <Input_1.Input placeholder="शहर" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)}/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            राज्य
          </label>
          <Input_1.Input placeholder="राज्य" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)}/>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          जिला
        </label>
        <Input_1.Input placeholder="जिला" value={formData.district} onChange={(e) => handleInputChange('district', e.target.value)}/>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          भुगतान की शर्तें
        </label>
        <select value={formData.paymentTerms} onChange={(e) => handleInputChange('paymentTerms', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="0">तुरंत भुगतान</option>
          <option value="7">7 दिन</option>
          <option value="15">15 दिन</option>
          <option value="30">30 दिन</option>
          <option value="45">45 दिन</option>
        </select>
        <p className="text-xs text-gray-500">
          किसानों से कितने दिन में भुगतान करेंगे
        </p>
      </div>

      
      <div className="text-center text-sm text-gray-500">
        <p>बाकी जानकारी बाद में भर सकते हैं</p>
        <p className="mt-1">अभी सिर्फ बुनियादी खाता बनाएं</p>
      </div>
    </div>);
    const renderStepIndicator = () => (<div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((stepNumber) => (<div key={stepNumber} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepNumber <= step
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500'}`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (<div className={`w-12 h-1 mx-2 ${stepNumber < step ? 'bg-blue-500' : 'bg-gray-200'}`}></div>)}
        </div>))}
    </div>);
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      
      <div className="absolute top-4 right-4">
        <LanguageSelector_1.default />
      </div>
      
      <Card_1.Card className="w-full max-w-md">
        <Card_1.CardHeader className="text-center">
          <Card_1.CardTitle className="text-2xl font-bold text-gray-800">
            {t('buyer')} {t('signup')}
          </Card_1.CardTitle>
        </Card_1.CardHeader>
        
        <Card_1.CardContent>
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            
            <div className="flex space-x-3">
              {step > 1 && (<Button_1.Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  पीछे जाएं
                </Button_1.Button>)}
              
              <Button_1.Button type={step === 3 ? 'submit' : 'button'} onClick={step < 3 ? () => setStep(step + 1) : undefined} disabled={isLoading} className="flex-1">
                {isLoading ? (<div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {step === 3 ? 'खाता बन रहा है...' : 'आगे जाएं...'}
                  </div>) : step === 3 ? ('खाता बनाएं') : ('आगे जाएं')}
              </Button_1.Button>
            </div>

            
            {step === 1 && (<div className="text-center">
                <button type="button" onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-gray-700 underline">
                  बाद में जानकारी भरें, अभी सिर्फ खाता बनाएं
                </button>
              </div>)}
          </form>

          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              पहले से खाता है?{' '}
              <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline">
                लॉगिन करें
              </button>
            </p>
          </div>
        </Card_1.CardContent>
      </Card_1.Card>
    </div>);
};
exports.default = BuyerSignupPage;
//# sourceMappingURL=BuyerSignupPage.js.map