// Comprehensive Data Sync Service
// Syncs all localStorage data to MongoDB database

interface SyncResult {
  success: boolean;
  syncedCount: number;
  errors: string[];
  message: string;
}

interface FarmerData {
  farmerId: string;
  farmerName: string;
  crops: any[];
  totalCrops: number;
  lastUpdated: string;
}

interface BuyerData {
  buyerId: string;
  buyerName: string;
  orders: any[];
  cart: any[];
  favorites: any[];
}

class DataSyncService {
  private backendUrl = 'https://acchadam1-backend.onrender.com';

  // Sync all farmer data from localStorage to database
  async syncAllFarmerData(): Promise<SyncResult> {
    console.log('🔄 STARTING COMPREHENSIVE DATA SYNC...');
    
    const result: SyncResult = {
      success: false,
      syncedCount: 0,
      errors: [],
      message: ''
    };

    try {
      // Get all localStorage keys
      const keys = Object.keys(localStorage);
      const farmerKeys = keys.filter(key => key.startsWith('farmer_database_'));
      
      console.log(`🔍 Found ${farmerKeys.length} farmer databases to sync`);
      
      if (farmerKeys.length === 0) {
        result.message = 'No farmer data found in localStorage';
        return result;
      }

      // Sync each farmer's data
      for (const key of farmerKeys) {
        try {
          const data = localStorage.getItem(key);
          if (!data) continue;

          const farmerData: FarmerData = JSON.parse(data);
          console.log(`🔄 Syncing farmer: ${farmerData.farmerName} (${farmerData.totalCrops} crops)`);

          // Sync each crop to database
          for (const crop of farmerData.crops) {
            await this.syncCropToDatabase(crop, farmerData.farmerId);
            result.syncedCount++;
          }

          console.log(`✅ Synced ${farmerData.totalCrops} crops for ${farmerData.farmerName}`);
        } catch (error) {
          const errorMsg = `Failed to sync farmer data from ${key}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      result.success = result.errors.length === 0;
      result.message = `Synced ${result.syncedCount} crops from ${farmerKeys.length} farmers`;
      
      console.log(`🎉 SYNC COMPLETE: ${result.message}`);
      return result;

    } catch (error) {
      const errorMsg = `Sync failed: ${error}`;
      console.error(`❌ ${errorMsg}`);
      result.errors.push(errorMsg);
      result.message = errorMsg;
      return result;
    }
  }

  // Sync individual crop to database
  private async syncCropToDatabase(crop: any, farmerId: string): Promise<boolean> {
    try {
      // Prepare crop data for database
      const cropData = {
        ...crop,
        farmerId: farmerId,
        uploadedAt: new Date().toISOString(),
        status: 'available',
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      };

      // Get valid token
      const token = await this.getValidToken();
      if (!token) {
        throw new Error('No valid authentication token');
      }

      // Save to database
      const response = await fetch(`${this.backendUrl}/api/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cropData)
      });

      if (response.ok) {
        console.log(`✅ Crop synced to database: ${crop.name}`);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ Failed to sync crop ${crop.name}: ${response.status} ${errorText}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error syncing crop ${crop.name}:`, error);
      return false;
    }
  }

  // Sync all buyer data from localStorage to database
  async syncAllBuyerData(): Promise<SyncResult> {
    console.log('🔄 SYNCING BUYER DATA...');
    
    const result: SyncResult = {
      success: false,
      syncedCount: 0,
      errors: [],
      message: ''
    };

    try {
      // Get buyer data from localStorage
      const buyerKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('buyer_database_') || 
        key.startsWith('buyer_orders_') || 
        key.startsWith('buyer_cart_')
      );

      console.log(`🔍 Found ${buyerKeys.length} buyer data keys to sync`);

      for (const key of buyerKeys) {
        try {
          const data = localStorage.getItem(key);
          if (!data) continue;

          const buyerData = JSON.parse(data);
          console.log(`🔄 Syncing buyer data: ${key}`);

          // Sync buyer orders
          if (buyerData.orders) {
            for (const order of buyerData.orders) {
              await this.syncOrderToDatabase(order, buyerData.buyerId);
              result.syncedCount++;
            }
          }

          // Sync buyer cart
          if (buyerData.cart) {
            for (const cartItem of buyerData.cart) {
              await this.syncCartItemToDatabase(cartItem, buyerData.buyerId);
              result.syncedCount++;
            }
          }

        } catch (error) {
          const errorMsg = `Failed to sync buyer data from ${key}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      result.success = result.errors.length === 0;
      result.message = `Synced ${result.syncedCount} buyer items from ${buyerKeys.length} keys`;
      
      console.log(`🎉 BUYER SYNC COMPLETE: ${result.message}`);
      return result;

    } catch (error) {
      const errorMsg = `Buyer sync failed: ${error}`;
      console.error(`❌ ${errorMsg}`);
      result.errors.push(errorMsg);
      result.message = errorMsg;
      return result;
    }
  }

  // Sync order to database
  private async syncOrderToDatabase(order: any, buyerId: string): Promise<boolean> {
    try {
      const token = await this.getValidToken();
      if (!token) return false;

      const response = await fetch(`${this.backendUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...order,
          buyerId: buyerId,
          isPermanent: true,
          crossDeviceAccess: true
        })
      });

      return response.ok;
    } catch (error) {
      console.error(`❌ Error syncing order:`, error);
      return false;
    }
  }

  // Sync cart item to database
  private async syncCartItemToDatabase(cartItem: any, buyerId: string): Promise<boolean> {
    try {
      const token = await this.getValidToken();
      if (!token) return false;

      const response = await fetch(`${this.backendUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...cartItem,
          buyerId: buyerId,
          isPermanent: true,
          crossDeviceAccess: true
        })
      });

      return response.ok;
    } catch (error) {
      console.error(`❌ Error syncing cart item:`, error);
      return false;
    }
  }

  // Get valid authentication token
  private async getValidToken(): Promise<string | null> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No auth token found');
      return null;
    }

    // Basic token validation
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Invalid token format');
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        console.error('❌ Token expired');
        return null;
      }

      return token;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      return null;
    }
  }

  // Force sync all data
  async forceSyncAllData(): Promise<SyncResult> {
    console.log('🚀 FORCE SYNCING ALL DATA TO DATABASE...');
    
    const farmerResult = await this.syncAllFarmerData();
    const buyerResult = await this.syncAllBuyerData();
    
    const totalResult: SyncResult = {
      success: farmerResult.success && buyerResult.success,
      syncedCount: farmerResult.syncedCount + buyerResult.syncedCount,
      errors: [...farmerResult.errors, ...buyerResult.errors],
      message: `Total synced: ${farmerResult.syncedCount + buyerResult.syncedCount} items`
    };

    console.log(`🎉 FORCE SYNC COMPLETE: ${totalResult.message}`);
    return totalResult;
  }

  // Clear all localStorage data after successful sync
  async clearLocalStorageAfterSync(): Promise<void> {
    console.log('🧹 CLEARING LOCALSTORAGE AFTER SYNC...');
    
    const keys = Object.keys(localStorage);
    const dataKeys = keys.filter(key => 
      key.startsWith('farmer_database_') || 
      key.startsWith('buyer_database_') ||
      key.startsWith('buyer_orders_') ||
      key.startsWith('buyer_cart_')
    );

    for (const key of dataKeys) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed: ${key}`);
    }

    console.log(`✅ Cleared ${dataKeys.length} localStorage keys`);
  }
}

// Create global sync service
export const dataSyncService = new DataSyncService();

// Auto-sync function
export const autoSyncAllData = async (): Promise<void> => {
  console.log('🔄 AUTO-SYNC: Starting automatic data synchronization...');
  
  try {
    const result = await dataSyncService.forceSyncAllData();
    
    if (result.success) {
      console.log('✅ AUTO-SYNC SUCCESS: All data synced to database');
      console.log('🌐 Data is now available across all devices');
      
      // Clear localStorage after successful sync
      await dataSyncService.clearLocalStorageAfterSync();
    } else {
      console.error('❌ AUTO-SYNC FAILED:', result.errors);
    }
  } catch (error) {
    console.error('❌ AUTO-SYNC ERROR:', error);
  }
};

export default dataSyncService;
