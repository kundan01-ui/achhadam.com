import React from 'react';
import { UserSettings } from '../../components/settings';

const SettingsPage: React.FC = () => {
  const handleSettingsSave = (data: any) => {
    console.log('Settings saved:', data);
    // Handle settings save logic
  };

  return (
    <div className="min-h-screen bg-neutral-gray">
      <UserSettings onSave={handleSettingsSave} />
    </div>
  );
};

export default SettingsPage;






