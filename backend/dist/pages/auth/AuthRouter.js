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
const LoginPage_1 = __importDefault(require("./LoginPage"));
const FarmerSignupPage_1 = __importDefault(require("./FarmerSignupPage"));
const BuyerSignupPage_1 = __importDefault(require("./BuyerSignupPage"));
const TransporterSignupPage_1 = __importDefault(require("./TransporterSignupPage"));
const AuthRouter = () => {
    const [currentPage, setCurrentPage] = (0, react_1.useState)('login');
    const [selectedUserType, setSelectedUserType] = (0, react_1.useState)('farmer');
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleUserTypeSelect = (userType) => {
        setSelectedUserType(userType);
        if (userType === 'farmer') {
            setCurrentPage('farmer-signup');
        }
        else if (userType === 'buyer') {
            setCurrentPage('buyer-signup');
        }
        else {
            setCurrentPage('transporter-signup');
        }
    };
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'login':
                return (<LoginPage_1.default onSignupClick={() => setCurrentPage('farmer-signup')} onUserTypeSelect={handleUserTypeSelect}/>);
            case 'farmer-signup':
                return (<FarmerSignupPage_1.default onBackToLogin={() => setCurrentPage('login')} onSwitchUserType={handleUserTypeSelect}/>);
            case 'buyer-signup':
                return (<BuyerSignupPage_1.default onBackToLogin={() => setCurrentPage('login')} onSwitchUserType={handleUserTypeSelect}/>);
            case 'transporter-signup':
                return (<TransporterSignupPage_1.default onBackToLogin={() => setCurrentPage('login')} onSwitchUserType={handleUserTypeSelect}/>);
            default:
                return <LoginPage_1.default onSignupClick={() => setCurrentPage('farmer-signup')}/>;
        }
    };
    return (<div className="min-h-screen">
      {renderCurrentPage()}
    </div>);
};
exports.default = AuthRouter;
//# sourceMappingURL=AuthRouter.js.map