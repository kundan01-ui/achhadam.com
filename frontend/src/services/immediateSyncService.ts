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

  // TOKEN REFRESH FUNCTION
  private async refreshToken(): Promise<string | null> {
    try {
      console.log('🔄 Attempting to refresh token...');
      
      // Get current token
      const currentToken = localStorage.getItem('authToken');
      if (!currentToken) {
        console.error('❌ No current token to refresh');
        return null;
      }

      // Try to refresh token via backend
      const response = await fetch(`${this.backendUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('✅ Token refreshed successfully');
          return data.token;
        }
      }

      console.log('⚠️ Token refresh not supported, using current token');
      return currentToken;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return null;
    }
  }

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

      // Get valid token with validation
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('❌ No auth token for immediate sync');
        return false;
      }

      // Validate token format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('❌ Invalid token format for immediate sync');
        return false;
      }

      // Check token expiry
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          console.error('❌ Token expired for immediate sync');
          return false;
        }
      } catch (error) {
        console.error('❌ Token validation failed for immediate sync');
        return false;
      }

      console.log(`🔑 Using valid token for immediate sync: ${token.substring(0, 20)}...`);

      // IMMEDIATE API CALL with retry logic and token refresh
      let response;
      let retryCount = 0;
      const maxRetries = 2;
      let currentToken = token;

      while (retryCount <= maxRetries) {
        try {
          response = await fetch(`${this.backendUrl}/api/crops`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(cropData)
          });

          console.log(`📡 IMMEDIATE SYNC Response: ${response.status} ${response.statusText}`);

          if (response.ok) {
            const responseData = await response.json();
            console.log(`✅ IMMEDIATE SYNC SUCCESS: ${crop.name} saved to MongoDB`);
            console.log(`📊 MongoDB Response:`, responseData);
            return true;
          } else if (response.status === 401) {
            console.error(`❌ 401 Unauthorized - Token rejected by server`);
            if (retryCount < maxRetries) {
              console.log(`🔄 Attempting token refresh (attempt ${retryCount + 1}/${maxRetries})...`);
              
              // Try to refresh token
              const refreshedToken = await this.refreshToken();
              if (refreshedToken && refreshedToken !== currentToken) {
                currentToken = refreshedToken;
                console.log(`✅ Token refreshed, retrying with new token...`);
              } else {
                console.log(`⚠️ Token refresh failed, retrying with current token...`);
              }
              
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
              continue;
            } else {
              console.error(`❌ IMMEDIATE SYNC FAILED: Max retries reached for ${crop.name}`);
              return false;
            }
          } else {
            const errorText = await response.text();
            console.error(`❌ IMMEDIATE SYNC FAILED: ${response.status} ${errorText}`);
            return false;
          }
        } catch (error) {
          console.error(`❌ Network error during immediate sync:`, error);
          if (retryCount < maxRetries) {
            console.log(`🔄 Retrying immediate sync due to network error (attempt ${retryCount + 1}/${maxRetries})...`);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            continue;
          } else {
            console.error(`❌ IMMEDIATE SYNC FAILED: Max retries reached due to network error`);
            return false;
          }
        }
      }

      return false;
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
      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ SYNC FAILED!\n\nYou must be logged in to sync data.\n\nPlease login first and try again.');
        return;
      }

      // Validate token before sync
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        alert('❌ SYNC FAILED!\n\nInvalid authentication token.\n\nPlease login again and try.');
        return;
      }

      // Check token expiry
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          alert('❌ SYNC FAILED!\n\nYour session has expired.\n\nPlease login again and try.');
          return;
        }
      } catch (error) {
        alert('❌ SYNC FAILED!\n\nInvalid authentication token.\n\nPlease login again and try.');
        return;
      }

      console.log('🔑 Token validation passed, proceeding with sync...');

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
