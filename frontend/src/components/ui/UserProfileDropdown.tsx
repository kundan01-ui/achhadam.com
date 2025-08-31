import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { User, Settings, LogOut, ChevronDown, Edit, Shield } from 'lucide-react';

interface UserProfileDropdownProps {
  user: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    userType?: string;
    email?: string;
  };
  onLogout: () => void;
  onProfileEdit: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  onLogout,
  onProfileEdit
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const getUserTypeLabel = (userType?: string) => {
    switch (userType) {
      case 'farmer': return 'Farmer';
      case 'buyer': return 'Buyer';
      case 'transporter': return 'Transporter';
      default: return userType || 'User';
    }
  };

  const getUserTypeColor = (userType?: string) => {
    switch (userType) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'buyer': return 'bg-blue-100 text-blue-800';
      case 'transporter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs sm:text-sm font-semibold">
            {user?.firstName?.[0]?.toUpperCase() || user?.phone?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-700">
            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.phone || 'User'}
          </p>
          <p className="text-xs text-gray-500">{getUserTypeLabel(user?.userType)}</p>
        </div>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              {/* User Info Header */}
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg font-semibold">
                      {user?.firstName?.[0]?.toUpperCase() || user?.phone?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.phone || 'User'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">{user?.phone || 'No phone'}</p>
                    {user?.email && (
                      <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:mt-3">
                  <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium ${getUserTypeColor(user?.userType)}`}>
                    {getUserTypeLabel(user?.userType)}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => {
                    onProfileEdit();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>View Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    onProfileEdit();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    // Handle settings
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    // Handle security
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span>Security</span>
                </button>
              </div>

              {/* Logout Section */}
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
