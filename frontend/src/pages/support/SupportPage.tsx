import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { HelpSupportCenter } from '../../components/support';

const SupportPage: React.FC = () => {
  const handleContactSupport = (data: any) => {
    console.log('Contact support:', data);
    // In a real app, this would send the message to support
  };

  const handleCreateTicket = (ticket: any) => {
    console.log('Create ticket:', ticket);
    // In a real app, this would create a support ticket
  };

  return (
    <DashboardLayout role="farmer" userName="Amit Sharma" userAvatar="">
      <HelpSupportCenter
        onContactSupport={handleContactSupport}
        onCreateTicket={handleCreateTicket}
      />
    </DashboardLayout>
  );
};

export default SupportPage;






