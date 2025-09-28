// IMMEDIATE DATA SYNC SERVICE
// Forces immediate sync of all localStorage data to MongoDB

interface ImmediateSyncResult {
  success: boolean;
  syncedCount: number;
  errors: string[];
  message: string;
}

class ImmediateSyncService {
  private backendUrl = 'https://acchadam1-backend.onrender.com';

  // IMMEDIATE SYNC - Force sync all data right now
  async immediateSyncAllData(): Promise<ImmediateSyncResult> {
    console.log('🚀 IMMEDIATE SYNC: Starting instant data synchronization...');
    
    const result: ImmediateSyncResult = {
      success: false,
      syncedCount: 0,
      errors: [],
      message: ''
    };

    try {
      // Get all localStorage keys
      const keys = Object.keys(localStorage);
      console.log('🔍 All localStorage keys:', keys);
      
      // Find all farmer data
      const farmerKeys = keys.filter(key => key.startsWith('farmer_database_'));
      console.log(`🌾 Found ${farmerKeys.length} farmer databases`);
      
      // Find all buyer data
      const buyerKeys = keys.filter(key => 
        key.startsWith('buyer_database_') || 
        key.startsWith('buyer_orders_') || 
        key.startsWith('buyer_cart_')
      );
      console.log(`🛒 Found ${buyerKeys.length} buyer databases`);

      // Sync all farmer data immediately
      for (const key of farmerKeys) {
        try {
          const data = localStorage.getItem(key);
          if (!data) continue;

          const farmerData = JSON.parse(data);
          console.log(`🔄 IMMEDIATE SYNC: Farmer ${farmerData.farmerName} (${farmerData.totalCrops} crops)`);

          // Sync each crop immediately
          for (const crop of farmerData.crops) {
            const syncResult = await this.immediateSyncCrop(crop, farmerData.farmerId);
            if (syncResult) {
              result.syncedCount++;
              console.log(`✅ IMMEDIATE SYNC: Crop ${crop.name} synced to MongoDB`);
            }
          }
        } catch (error) {
          const errorMsg = `Failed to sync farmer ${key}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      // Sync all buyer data immediately
      for (const key of buyerKeys) {
        try {
          const data = localStorage.getItem(key);
          if (!data) continue;

          const buyerData = JSON.parse(data);
          console.log(`🔄 IMMEDIATE SYNC: Buyer data ${key}`);

          // Sync orders
          if (buyerData.orders) {
            for (const order of buyerData.orders) {
              const syncResult = await this.immediateSyncOrder(order, buyerData.buyerId);
              if (syncResult) {
                result.syncedCount++;
                console.log(`✅ IMMEDIATE SYNC: Order synced to MongoDB`);
              }
            }
          }

          // Sync cart
          if (buyerData.cart) {
            for (const cartItem of buyerData.cart) {
              const syncResult = await this.immediateSyncCartItem(cartItem, buyerData.buyerId);
              if (syncResult) {
                result.syncedCount++;
                console.log(`✅ IMMEDIATE SYNC: Cart item synced to MongoDB`);
              }
            }
          }
        } catch (error) {
          const errorMsg = `Failed to sync buyer ${key}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      result.success = result.errors.length === 0;
      result.message = `IMMEDIATE SYNC COMPLETE: ${result.syncedCount} items synced to MongoDB`;
      
      console.log(`🎉 ${result.message}`);
      return result;

    } catch (error) {
      const errorMsg = `IMMEDIATE SYNC FAILED: ${error}`;
      console.error(`❌ ${errorMsg}`);
      result.errors.push(errorMsg);
      result.message = errorMsg;
      return result;
    }
  }

  // IMMEDIATE CROP SYNC
  private async immediateSyncCrop(crop: any, farmerId: string): Promise<boolean> {
    try {
      console.log(`🚀 IMMEDIATE SYNC: Syncing crop ${crop.name} to MongoDB...`);
      
      // Prepare crop data for MongoDB
      const cropData = {
        ...crop,
        farmerId: farmerId,
        uploadedAt: new Date().toISOString(),
        status: 'available',
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true,
        syncedAt: new Date().toISOString(),
        source: 'localStorage_sync'
      };

      // Get valid token
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('❌ No auth token for immediate sync');
        return false;
      }

      // IMMEDIATE API CALL
      const response = await fetch(`${this.backendUrl}/api/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cropData)
      });

      console.log(`📡 IMMEDIATE SYNC Response: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ IMMEDIATE SYNC SUCCESS: ${crop.name} saved to MongoDB`);
        console.log(`📊 MongoDB Response:`, responseData);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ IMMEDIATE SYNC FAILED: ${response.status} ${errorText}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ IMMEDIATE SYNC ERROR for ${crop.name}:`, error);
      return false;
    }
  }

  // IMMEDIATE ORDER SYNC
  private async immediateSyncOrder(order: any, buyerId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('authToken');
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
          crossDeviceAccess: true,
          syncedAt: new Date().toISOString(),
          source: 'localStorage_sync'
        })
      });

      return response.ok;
    } catch (error) {
      console.error(`❌ Order sync error:`, error);
      return false;
    }
  }

  // IMMEDIATE CART SYNC
  private async immediateSyncCartItem(cartItem: any, buyerId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('authToken');
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
          crossDeviceAccess: true,
          syncedAt: new Date().toISOString(),
          source: 'localStorage_sync'
        })
      });

      return response.ok;
    } catch (error) {
      console.error(`❌ Cart sync error:`, error);
      return false;
    }
  }

  // FORCE SYNC ALL DATA NOW
  async forceSyncNow(): Promise<void> {
    console.log('🚀 FORCE SYNC NOW: Starting immediate synchronization...');
    
    try {
      const result = await this.immediateSyncAllData();
      
      if (result.success) {
        console.log('✅ FORCE SYNC SUCCESS: All data synced to MongoDB');
        console.log(`📊 Synced ${result.syncedCount} items to database`);
        
        // Show success message
        alert(`✅ IMMEDIATE SYNC SUCCESS!\n\nSynced ${result.syncedCount} items to MongoDB.\n\nYour data is now available across all devices!`);
      } else {
        console.error('❌ FORCE SYNC FAILED:', result.errors);
        alert(`❌ SYNC FAILED!\n\nErrors: ${result.errors.join(', ')}\n\nPlease try again.`);
      }
    } catch (error) {
      console.error('❌ FORCE SYNC ERROR:', error);
      alert(`❌ SYNC ERROR!\n\n${error}\n\nPlease check your connection and try again.`);
    }
  }
}

// Create global immediate sync service
export const immediateSyncService = new ImmediateSyncService();

// FORCE SYNC NOW function
export const forceSyncNow = async (): Promise<void> => {
  console.log('🚀 FORCE SYNC NOW: User requested immediate sync...');
  await immediateSyncService.forceSyncNow();
};

export default immediateSyncService;
