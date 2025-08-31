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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLanguage = exports.LanguageProvider = void 0;
const react_1 = __importStar(require("react"));
const languages_1 = require("../config/languages");
const LanguageContext = (0, react_1.createContext)(undefined);
const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = (0, react_1.useState)(languages_1.DEFAULT_LANGUAGE);
    (0, react_1.useEffect)(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && languages_1.SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);
    const setLanguage = (language) => {
        setCurrentLanguage(language);
        localStorage.setItem('selectedLanguage', language);
    };
    const t = (key) => {
        const { getTranslation } = require('../translations');
        return getTranslation(currentLanguage, key);
    };
    const value = {
        currentLanguage,
        setLanguage,
        supportedLanguages: languages_1.SUPPORTED_LANGUAGES,
        t
    };
    return (<LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>);
};
exports.LanguageProvider = LanguageProvider;
const useLanguage = () => {
    const context = (0, react_1.useContext)(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
exports.useLanguage = useLanguage;
//# sourceMappingURL=LanguageContext.js.map