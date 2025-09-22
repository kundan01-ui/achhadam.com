// Test script to verify user-specific data
export const testUserSpecificData = () => {
  console.log('🧪 Testing User-Specific Data Logic');
  
  // Check all localStorage keys
  const allKeys = Object.keys(localStorage);
  const farmerKeys = allKeys.filter(key => key.startsWith('farmer_'));
  
  console.log('📋 All localStorage keys:', allKeys);
  console.log('🌾 Farmer database keys:', farmerKeys);
  
  // Check current user ID
  const currentUserId = localStorage.getItem('farmer_user_id');
  console.log('👤 Current user ID:', currentUserId);
  
  // Check each farmer database
  farmerKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`📊 Database ${key}:`, {
          farmerId: parsed.farmerId,
          farmerName: parsed.farmerName,
          totalCrops: parsed.crops?.length || 0,
          lastUpdated: parsed.lastUpdated,
          crops: parsed.crops?.map(crop => ({
            name: crop.name,
            farmerId: crop.farmerId,
            farmerName: crop.farmerName,
            uploadedAt: crop.uploadedAt
          })) || []
        });
      } catch (error) {
        console.error(`❌ Error parsing ${key}:`, error);
      }
    }
  });
  
  // Check data persistence
  if (currentUserId) {
    const userDatabase = localStorage.getItem(`farmer_database_${currentUserId}`);
    if (userDatabase) {
      const parsed = JSON.parse(userDatabase);
      console.log(`✅ Data persistence verified for current user:`, {
        farmerId: parsed.farmerId,
        farmerName: parsed.farmerName,
        totalCrops: parsed.crops?.length || 0,
        lastUpdated: parsed.lastUpdated
      });
    } else {
      console.log(`❌ No data found for current user ID: ${currentUserId}`);
    }
  }
  
  return farmerKeys;
};

// Clear all farmer data (for testing)
export const clearAllFarmerData = () => {
  console.log('🗑️ Clearing all farmer data...');
  const allKeys = Object.keys(localStorage);
  const farmerKeys = allKeys.filter(key => key.startsWith('farmer_'));
  
  farmerKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed ${key}`);
  });
  
  // Also clear user ID
  localStorage.removeItem('farmer_user_id');
  console.log(`🗑️ Removed farmer_user_id`);
  
  console.log('✅ All farmer data cleared');
  console.log('🔄 Please refresh the page to see changes');
};
