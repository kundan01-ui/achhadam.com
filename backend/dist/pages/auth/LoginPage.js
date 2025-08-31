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
const LoginPage = ({ onSignupClick, onUserTypeSelect }) => {
    const { t } = (0, LanguageContext_1.useLanguage)();
    const [formData, setFormData] = (0, react_1.useState)({
        phone: '',
        password: '',
        userType: 'farmer'
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Login attempt:', formData);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      
      <div className="absolute top-4 right-4">
        <LanguageSelector_1.default />
      </div>
      
      <Card_1.Card className="w-full max-w-md">
        <Card_1.CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🌾</span>
          </div>
          <Card_1.CardTitle className="text-2xl font-bold text-gray-800">
            {t('welcome')}
          </Card_1.CardTitle>
          <p className="text-gray-600 mt-2">
            {t('login')}
          </p>
        </Card_1.CardHeader>
        
        <Card_1.CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t('iAm')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
            { value: 'farmer', label: t('farmer'), icon: '👨‍🌾' },
            { value: 'buyer', label: t('buyer'), icon: '🏪' },
            { value: 'transporter', label: t('transporter'), icon: '🚛' }
        ].map((type) => (<button key={type.value} type="button" onClick={() => handleInputChange('userType', type.value)} className={`p-3 rounded-lg border-2 transition-all ${formData.userType === type.value
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>))}
              </div>
            </div>

            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t('phone')} *
              </label>
              <Input_1.Input type="tel" placeholder={t('enterPhone')} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} maxLength={10} required className="text-center text-lg"/>
            </div>

            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t('password')} *
              </label>
              <Input_1.Input type="password" placeholder={t('enterPassword')} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} required className="text-center text-lg"/>
            </div>

            
            <div className="text-right">
              <button type="button" className="text-sm text-green-600 hover:text-green-700 underline">
                {t('forgotPassword')}
              </button>
            </div>

            
            <Button_1.Button type="submit" disabled={isLoading} className="w-full py-3 text-lg font-medium">
              {isLoading ? (<div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('loading')}
                </div>) : (t('login'))}
            </Button_1.Button>

                        
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('or')}</span>
              </div>
            </div>

            
            <div className="text-center">
              <p className="text-gray-600">
                {t('dontHaveAccount')}{' '}
                <button type="button" onClick={onSignupClick} className="text-green-600 hover:text-green-700 font-medium underline">
                  {t('signup')}
                </button>
              </p>
            </div>
          </form>
        </Card_1.CardContent>
      </Card_1.Card>
    </div>);
};
exports.default = LoginPage;
//# sourceMappingURL=LoginPage.js.map