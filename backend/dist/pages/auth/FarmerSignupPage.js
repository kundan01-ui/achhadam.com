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
const FarmerSignupPage = () => {
    const { t } = (0, LanguageContext_1.useLanguage)();
    const [step, setStep] = (0, react_1.useState)(1);
    const [formData, setFormData] = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        farmName: '',
        farmSize: '',
        farmSizeUnit: 'acres',
        village: '',
        district: '',
        state: '',
        mainCrops: [],
        experience: ''
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Farmer signup:', formData);
        setTimeout(() => {
            setIsLoading(false);
            if (step < 3) {
                setStep(step + 1);
            }
        }, 2000);
    };
    const renderStep1 = () => (<div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">👨‍🌾</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {t('farmer')} {t('signup')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('step1Desc')}
        </p>
      </div>

      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('firstName')} *
          </label>
          <Input_1.Input placeholder={t('enterFirstName')} value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('lastName')} *
          </label>
          <Input_1.Input placeholder={t('enterLastName')} value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required/>
        </div>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('phone')} *
        </label>
        <Input_1.Input type="tel" placeholder={t('enterPhone')} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} maxLength={10} required className="text-center text-lg"/>
        <p className="text-xs text-gray-500">
          {t('phoneHelp')}
        </p>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('password')} *
        </label>
        <Input_1.Input type="password" placeholder={t('enterPassword')} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} minLength={6} required/>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('confirmPassword')} *
        </label>
        <Input_1.Input type="password" placeholder={t('enterConfirmPassword')} value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} required/>
      </div>

      
      <div className="flex items-start space-x-2">
        <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 text-green-600"/>
        <label htmlFor="terms" className="text-sm text-gray-600">
          {t('agreeTerms')}
        </label>
      </div>
    </div>);
    const renderStep2 = () => (<div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('step2')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('step2Desc')}
        </p>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('farmName')}
        </label>
        <Input_1.Input placeholder={t('enterFarmName')} value={formData.farmName} onChange={(e) => handleInputChange('farmName', e.target.value)}/>
      </div>

      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('farmSize')}
          </label>
          <Input_1.Input type="number" placeholder="Size" value={formData.farmSize} onChange={(e) => handleInputChange('farmSize', e.target.value)}/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Unit
          </label>
          <select value={formData.farmSizeUnit} onChange={(e) => handleInputChange('farmSizeUnit', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="acres">{t('acres')}</option>
            <option value="hectares">{t('hectares')}</option>
            <option value="bighas">{t('bighas')}</option>
            <option value="kanals">{t('kanals')}</option>
          </select>
        </div>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('village')}
        </label>
        <Input_1.Input placeholder={t('enterVillage')} value={formData.village} onChange={(e) => handleInputChange('village', e.target.value)}/>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('district')}
          </label>
          <Input_1.Input placeholder={t('enterDistrict')} value={formData.district} onChange={(e) => handleInputChange('district', e.target.value)}/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('state')}
          </label>
          <Input_1.Input placeholder={t('enterState')} value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)}/>
        </div>
      </div>
    </div>);
    const renderStep3 = () => (<div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('step3')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('cropsHelp')}
        </p>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('mainCrops')}
        </label>
        <Input_1.Input placeholder={t('enterCrops')} value={formData.mainCrops.join(', ')} onChange={(e) => handleInputChange('mainCrops', e.target.value.split(',').map(crop => crop.trim()))}/>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('experience')}
        </label>
        <select value={formData.experience} onChange={(e) => handleInputChange('experience', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select Experience</option>
          <option value="0-2">{t('exp0to2')}</option>
          <option value="3-5">{t('exp3to5')}</option>
          <option value="6-10">{t('exp6to10')}</option>
          <option value="10+">{t('exp10plus')}</option>
        </select>
      </div>

      
      <div className="text-center text-sm text-gray-500">
        <p>{t('canFillLater')}</p>
        <p className="mt-1">{t('basicAccountFirst')}</p>
      </div>
    </div>);
    const renderStepIndicator = () => (<div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((stepNumber) => (<div key={stepNumber} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepNumber <= step
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'}`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (<div className={`w-12 h-1 mx-2 ${stepNumber < step ? 'bg-green-500' : 'bg-gray-200'}`}></div>)}
        </div>))}
    </div>);
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      
      <div className="absolute top-4 right-4">
        <LanguageSelector_1.default />
      </div>
      
      <Card_1.Card className="w-full max-w-md">
        <Card_1.CardHeader className="text-center">
          <Card_1.CardTitle className="text-2xl font-bold text-gray-800">
            {t('farmer')} {t('signup')}
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
                  {t('back')}
                </Button_1.Button>)}
              
              <Button_1.Button type={step === 3 ? 'submit' : 'button'} onClick={step < 3 ? () => setStep(step + 1) : undefined} disabled={isLoading} className="flex-1">
                {isLoading ? (<div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {step === 3 ? t('loading') : t('loading')}
                  </div>) : step === 3 ? (t('submit')) : (t('next'))}
              </Button_1.Button>
            </div>

            
            {step === 1 && (<div className="text-center">
                <button type="button" onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-gray-700 underline">
                  {t('skipForNow')}
                </button>
              </div>)}
          </form>

          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <button type="button" className="text-green-600 hover:text-green-700 font-medium underline">
                {t('login')}
              </button>
            </p>
          </div>
        </Card_1.CardContent>
      </Card_1.Card>
    </div>);
};
exports.default = FarmerSignupPage;
//# sourceMappingURL=FarmerSignupPage.js.map