import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Filter, Search, Mail, Package, AlertTriangle, Info, Star, Clock, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui';

interface Notification {
  id: string;
  type: 'order' | 'product' | 'system' | 'price' | 'verification';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    amount?: number;
    status?: string;
  };
}

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onDeleteAll?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNotificationClick,
  onMarkAllRead,
  onDeleteAll
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Order #ORD-2024-001 Confirmed',
        message: 'Your order for 50kg Wheat has been confirmed and is being processed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        priority: 'high',
        actionUrl: '/orders/ORD-2024-001',
        metadata: {
          orderId: 'ORD-2024-001',
          amount: 2500,
          status: 'confirmed'
        }
      },
      {
        id: '2',
        type: 'product',
        title: 'Price Alert: Rice Price Dropped',
        message: 'The price of Basmati Rice has dropped by ₹2/kg. Check it out now!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        priority: 'medium',
        actionUrl: '/products/rice-basmati',
        metadata: {
          productId: 'rice-basmati',
          amount: 45
        }
      },
      {
        id: '3',
        type: 'verification',
        title: 'Account Verification Complete',
        message: 'Congratulations! Your account has been successfully verified.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        priority: 'low',
        actionUrl: '/profile'
      },
      {
        id: '4',
        type: 'system',
        title: 'Maintenance Scheduled',
        message: 'System maintenance is scheduled for tomorrow at 2:00 AM. Service may be temporarily unavailable.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        isRead: true,
        priority: 'medium'
      },
      {
        id: '5',
        type: 'order',
        title: 'Order #ORD-2024-002 Shipped',
        message: 'Your order for 25kg Tomatoes has been shipped and is on its way.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        isRead: true,
        priority: 'medium',
        actionUrl: '/orders/ORD-2024-002',
        metadata: {
          orderId: 'ORD-2024-002',
          amount: 1200,
          status: 'shipped'
        }
      },
      {
        id: '6',
        type: 'price',
        title: 'New Product Available',
        message: 'Fresh Organic Potatoes are now available at ₹30/kg. Limited stock!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        isRead: true,
        priority: 'low',
        actionUrl: '/products/potatoes-organic'
      }
    ];

    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);

  // Filter notifications based on search and filters
  useEffect(() => {
    let filtered = notifications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedType);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === selectedPriority);
    }

    // Filter by read status
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.isRead);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, selectedType, selectedPriority, showUnreadOnly]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    onMarkAllRead?.();
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    onDeleteAll?.();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'product':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-600" />;
      case 'price':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'verification':
        return <Check className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const typeOptions: SelectOption[] = [
    { value: 'all', label: 'All Types' },
    { value: 'order', label: 'Orders' },
    { value: 'product', label: 'Products' },
    { value: 'system', label: 'System' },
    { value: 'price', label: 'Price Alerts' },
    { value: 'verification', label: 'Verification' }
  ];

  const priorityOptions: SelectOption[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button onClick={handleDeleteAll} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div>
              <Select
                options={typeOptions}
                value={selectedType}
                onChange={setSelectedType}
                placeholder="Filter by type"
              />
            </div>
            <div>
              <Select
                options={priorityOptions}
                value={selectedPriority}
                onChange={setSelectedPriority}
                placeholder="Filter by priority"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Unread only</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedType !== 'all' || selectedPriority !== 'all' || showUnreadOnly
                  ? 'Try adjusting your filters or search terms.'
                  : 'You\'re all caught up! Check back later for new updates.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                notification.isRead ? 'opacity-75' : 'ring-2 ring-green-200'
              }`}
              onClick={() => onNotificationClick?.(notification)}
            >
              <CardContent className="p-4">
                <div className={`flex items-start gap-4 border-l-4 pl-4 ${getPriorityColor(notification.priority)}`}>
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {notification.metadata && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {notification.metadata.orderId && (
                              <span>Order: {notification.metadata.orderId}</span>
                            )}
                            {notification.metadata.amount && (
                              <span>₹{notification.metadata.amount}</span>
                            )}
                            {notification.metadata.status && (
                              <span className="capitalize">{notification.metadata.status}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination or Load More */}
      {filteredNotifications.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full md:w-auto">
            Load More Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;






