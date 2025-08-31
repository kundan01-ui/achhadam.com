import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ChevronDown,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface HeaderProps {
  role: string;
  userName: string;
  userAvatar?: string;
  onMenuToggle?: () => void;
  onLogout?: () => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  role, 
  userName, 
  userAvatar, 
  onMenuToggle, 
  onLogout,
  className 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      message: 'You have received a new order for 100kg wheat',
      time: '2 minutes ago',
      type: 'order',
      unread: true
    },
    {
      id: 2,
      title: 'Price Update',
      message: 'Rice prices have increased by 5% in your area',
      time: '1 hour ago',
      type: 'price',
      unread: true
    },
    {
      id: 3,
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in your region tomorrow',
      time: '3 hours ago',
      type: 'weather',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'price':
        return '💰';
      case 'weather':
        return '🌧️';
      default:
        return '🔔';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'farmer':
        return 'Farmer';
      case 'buyer':
        return 'Buyer';
      case 'transporter':
        return 'Transporter';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  return (
    <header className={cn(
      "bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between",
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-agricultural hover:bg-neutral-gray transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-text-dark" />
          </button>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              type="text"
              placeholder="Search products, farmers, or markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-agricultural focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="ml-2"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-agricultural hover:bg-neutral-gray transition-colors duration-200"
          >
            <Bell className="w-5 h-5 text-text-dark" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-agricultural shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-dark">Notifications</h3>
                  <button className="text-sm text-primary-green hover:text-secondary-green">
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-gray-100 hover:bg-neutral-gray transition-colors duration-200 cursor-pointer",
                        notification.unread && "bg-blue-50"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-dark">
                            {notification.title}
                          </p>
                          <p className="text-sm text-text-light mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-text-light mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary-green rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-text-light">
                    No notifications
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                >
                  View All Notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <button className="relative p-2 rounded-agricultural hover:bg-neutral-gray transition-colors duration-200">
          <MessageSquare className="w-5 h-5 text-text-dark" />
          <span className="absolute -top-1 -right-1 bg-warning text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </button>

        {/* Help */}
        <button className="p-2 rounded-agricultural hover:bg-neutral-gray transition-colors duration-200">
          <HelpCircle className="w-5 h-5 text-text-dark" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-agricultural hover:bg-neutral-gray transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-agricultural rounded-full flex items-center justify-center">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-dark">{userName}</p>
              <p className="text-xs text-text-light capitalize">{getRoleDisplayName(role)}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-light" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-agricultural shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-agricultural rounded-full flex items-center justify-center">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-dark">{userName}</p>
                    <p className="text-xs text-text-light capitalize">{getRoleDisplayName(role)}</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <button className="w-full flex items-center px-4 py-2 text-sm text-text-dark hover:bg-neutral-gray transition-colors duration-200">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm text-text-dark hover:bg-neutral-gray transition-colors duration-200">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
              </div>
              <div className="border-t border-gray-200 py-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search (Overlay) */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setShowNotifications(false)}
        />
      )}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;



