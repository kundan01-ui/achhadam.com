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
const AuthRouter_1 = __importDefault(require("./pages/auth/AuthRouter"));
const LanguageContext_1 = require("./contexts/LanguageContext");
const Dashboard_1 = __importDefault(require("./components/Dashboard"));
const App = () => {
    const [appState, setAppState] = (0, react_1.useState)('auth');
    const [userType, setUserType] = (0, react_1.useState)('farmer');
    const handleLoginSuccess = (type) => {
        setUserType(type);
        setAppState('dashboard');
    };
    const handleLogout = () => {
        setAppState('auth');
    };
    const renderContent = () => {
        switch (appState) {
            case 'auth':
                return (<AuthRouter_1.default />);
            case 'dashboard':
                return <Dashboard_1.default userType={userType} onLogout={handleLogout}/>;
            default:
                return <AuthRouter_1.default />;
        }
    };
    return (<LanguageContext_1.LanguageProvider>
      <div className="App">
        {renderContent()}
      </div>
    </LanguageContext_1.LanguageProvider>);
};
exports.default = App;
//# sourceMappingURL=App.js.map