import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Bell, Shield, Palette, Globe, Save, X } from 'lucide-react';

interface UserSettingsProps {
  onSave: (data: any) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: 'limited',
      locationSharing: false
    },
    appearance: {
      theme: 'light',
      language: 'en',
      fontSize: 'medium'
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30'
    }
  });

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleSave = () => {
    setIsEditing(false);
    onSave(settingsData);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
          <p className="text-sm text-gray-500">Receive updates via email</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.email}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, email: e.target.checked }
          }))}
          disabled={!isEditing}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
          <p className="text-sm text-gray-500">Receive updates via SMS</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.sms}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, sms: e.target.checked }
          }))}
          disabled={!isEditing}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
          <p className="text-sm text-gray-500">Receive updates via push notifications</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.push}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, push: e.target.checked }
          }))}
          disabled={!isEditing}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Marketing Communications</h3>
          <p className="text-sm text-gray-500">Receive marketing and promotional content</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.marketing}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, marketing: e.target.checked }
          }))}
          disabled={!isEditing}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
        <Select
          options={[
            { value: 'public', label: 'Public' },
            { value: 'friends', label: 'Friends Only' },
            { value: 'private', label: 'Private' }
          ]}
          value={settings.privacy.profileVisibility}
          onChange={(value) => setSettings(prev => ({
            ...prev,
            privacy: { ...prev.privacy, profileVisibility: value }
          }))}
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Data Sharing</label>
        <Select
          options={[
            { value: 'full', label: 'Full Sharing' },
            { value: 'limited', label: 'Limited Sharing' },
            { value: 'none', label: 'No Sharing' }
          ]}
          value={settings.privacy.dataSharing}
          onChange={(value) => setSettings(prev => ({
            ...prev,
            privacy: { ...prev.privacy, dataSharing: value }
          }))}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Location Sharing</h3>
          <p className="text-sm text-gray-500">Allow sharing your location with other users</p>
        </div>
        <input
          type="checkbox"
          checked={settings.privacy.locationSharing}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            privacy: { ...prev.privacy, locationSharing: e.target.checked }
          }))}
          disabled={!isEditing}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
        <Select
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto (System)' }
          ]}
          value={settings.appearance.theme}
          onChange={(value) => setSettings(prev => ({
            ...prev,
            appearance: { ...prev.appearance, theme: value }
          }))}
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
        <Select
          options={[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'हिंदी' },
            { value: 'gu', label: 'ગુજરાતી' },
            { value: 'mr', label: 'मराठी' },
            { value: 'bn', label: 'বাংলা' }
          ]}
          value={settings.appearance.language}
          onChange={(value) => setSettings(prev => ({
            ...prev,
            appearance: { ...prev.appearance, language: value }
          }))}
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <Select
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ]}
          value={settings.appearance.fontSize}
          onChange={(value) => setSettings(prev => ({
            ...prev,
            appearance: { ...prev.appearance, fontSize: value }
          }))}
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </div>
        <input
          type="checkbox"
          checked={settings.security.twoFactor}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            security: { ...prev.security, twoFactor: e.target.checked }
          }))}
          disabled={!isEditing}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
        <Select
          options={[
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '120', label: '2 hours' }
          ]}
          value={settings.security.sessionTimeout}
          onChange={(value) => setSettings(prev => ({
            ...prev,
            security: { ...prev.security, sessionTimeout: value }
          }))}
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return renderNotifications();
      case 'privacy':
        return renderPrivacy();
      case 'appearance':
        return renderAppearance();
      case 'security':
        return renderSecurity();
      default:
        return renderNotifications();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit Settings
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-green-100 text-green-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderTabContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
