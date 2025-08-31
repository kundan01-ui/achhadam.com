import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { NotificationCenter } from '../../components/notifications';

const NotificationsPage: React.FC = () => {
  const handleNotificationClick = (notification: any) => {
    console.log('Notification clicked:', notification);
    // In a real app, this would navigate to the relevant page
  };

  const handleMarkAllRead = () => {
    console.log('Mark all notifications as read');
    // In a real app, this would update the backend
  };

  const handleDeleteAll = () => {
    console.log('Delete all notifications');
    // In a real app, this would update the backend
  };

  return (
    <DashboardLayout role="farmer" userName="Amit Sharma" userAvatar="">
      <NotificationCenter
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllRead}
        onDeleteAll={handleDeleteAll}
      />
    </DashboardLayout>
  );
};

export default NotificationsPage;






