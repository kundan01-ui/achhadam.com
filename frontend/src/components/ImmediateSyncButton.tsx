// IMMEDIATE SYNC BUTTON COMPONENT
// Forces immediate sync of all data to MongoDB

import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, Zap } from 'lucide-react';
import { forceSyncNow } from '../services/immediateSyncService';

interface ImmediateSyncButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const ImmediateSyncButton: React.FC<ImmediateSyncButtonProps> = ({ 
  className = '', 
  variant = 'primary',
  size = 'md'
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const handleImmediateSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('');

    try {
      console.log('🚀 IMMEDIATE SYNC: User triggered instant synchronization...');
      
      await forceSyncNow();
      
      setSyncStatus('success');
      setSyncMessage('✅ All data synced to MongoDB!');
      console.log('✅ IMMEDIATE SYNC SUCCESS: All data synced to database');
      
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`❌ Sync failed: ${error}`);
      console.error('❌ IMMEDIATE SYNC FAILED:', error);
    } finally {
      setIsSyncing(false);
      
      // Clear status message after 8 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 8000);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const statusClasses = {
      idle: '',
      success: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${statusClasses[syncStatus]} ${className}`;
  };

  const getIcon = () => {
    if (isSyncing) {
      return <Zap className="animate-pulse" size={16} />;
    }
    
    switch (syncStatus) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'error':
        return <XCircle size={16} />;
      default:
        return <Database size={16} />;
    }
  };

  const getButtonText = () => {
    if (isSyncing) return 'Syncing Now...';
    if (syncStatus === 'success') return 'Synced!';
    if (syncStatus === 'error') return 'Failed';
    return 'Sync to MongoDB';
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleImmediateSync}
        disabled={isSyncing}
        className={getButtonClasses()}
      >
        {getIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </button>
      
      {syncMessage && (
        <div className={`text-sm text-center max-w-xs ${
          syncStatus === 'success' ? 'text-green-600' : 
          syncStatus === 'error' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {syncMessage}
        </div>
      )}
      
      {isSyncing && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <AlertTriangle size={14} />
          <span>Syncing all data to MongoDB now...</span>
        </div>
      )}
    </div>
  );
};

export default ImmediateSyncButton;
