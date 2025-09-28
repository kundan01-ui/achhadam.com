// Manual Data Sync Button Component
// Allows users to manually trigger data synchronization

import React, { useState } from 'react';
import { RefreshCw, Database, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { dataSyncService } from '../services/dataSyncService';

interface SyncButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const SyncButton: React.FC<SyncButtonProps> = ({ 
  className = '', 
  variant = 'primary',
  size = 'md'
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('');

    try {
      console.log('🔄 MANUAL SYNC: User triggered data synchronization');
      
      const result = await dataSyncService.forceSyncAllData();
      
      if (result.success) {
        setSyncStatus('success');
        setSyncMessage(`✅ Synced ${result.syncedCount} items successfully`);
        console.log('✅ MANUAL SYNC SUCCESS:', result.message);
      } else {
        setSyncStatus('error');
        setSyncMessage(`❌ Sync failed: ${result.errors.join(', ')}`);
        console.error('❌ MANUAL SYNC FAILED:', result.errors);
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`❌ Sync error: ${error}`);
      console.error('❌ MANUAL SYNC ERROR:', error);
    } finally {
      setIsSyncing(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 5000);
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
      primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
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
      return <RefreshCw className="animate-spin" size={16} />;
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
    if (isSyncing) return 'Syncing...';
    if (syncStatus === 'success') return 'Synced';
    if (syncStatus === 'error') return 'Failed';
    return 'Sync Data';
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleSync}
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
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertTriangle size={14} />
          <span>Syncing all data to database...</span>
        </div>
      )}
    </div>
  );
};

export default SyncButton;
