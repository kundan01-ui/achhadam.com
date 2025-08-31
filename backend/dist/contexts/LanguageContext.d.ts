import React, { ReactNode } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../config/languages';
interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (language: Language) => void;
    supportedLanguages: typeof SUPPORTED_LANGUAGES;
    t: (key: string) => string;
}
interface LanguageProviderProps {
    children: ReactNode;
}
export declare const LanguageProvider: React.FC<LanguageProviderProps>;
export declare const useLanguage: () => LanguageContextType;
export {};
//# sourceMappingURL=LanguageContext.d.ts.map