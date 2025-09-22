// Marketplace Service - Loads real farmer crop data for buyers

interface CropData {
  id: string;
  name: string;
  type: string;
  variety: string;
  quantity: number;
  unit: string;
  quality: string;
  price: number;
  harvestDate: string;
  organic: boolean;
  location: string;
  description: string;
  status: string;
  uploadedAt: string;
  farmerName: string;
  farmerId: string;
  images: any[];
  analytics: {
    totalImages: number;
    bestImageId: string | null;
    averageImageQuality: string | null;
    cropHealthScore: number | null;
    marketValue: number | null;
    demandScore: number | null;
  };
  database: {
    isSynced: boolean;
    lastSyncDate: string | null;
    version: number;
    checksum: string | null;
  };
}

interface FarmerData {
  id: string;
  name: string;
  phone: string;
  location: string;
  rating: number;
  totalCrops: number;
  joinedDate: string;
  avatar?: string;
}

interface MarketplaceCrop extends CropData {
  farmer: FarmerData;
  distance?: number;
  demandScore: number;
  priceComparison: {
    marketAverage: number;
    isAboveAverage: boolean;
    percentageDifference: number;
  };
}

// Calculate demand score for crops based on real data
const calculateDemandScore = (crop: CropData): number => {
  let score = 50; // Base score
  
  // Quality bonus
  if (crop.quality === 'A') score += 20;
  else if (crop.quality === 'B') score += 10;
  else if (crop.quality === 'C') score += 5;
  
  // Organic bonus
  if (crop.organic) score += 15;
  
  // Fresh harvest bonus
  const harvestDate = new Date(crop.harvestDate);
  const daysSinceHarvest = Math.floor((Date.now() - harvestDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceHarvest <= 7) score += 15;
  else if (daysSinceHarvest <= 14) score += 10;
  else if (daysSinceHarvest <= 30) score += 5;
  
  // Price competitiveness
  if (crop.price < 50) score += 10;
  else if (crop.price > 100) score -= 5;
  
  // Quantity availability
  if (crop.quantity > 100) score += 5;
  else if (crop.quantity < 20) score -= 5;
  
  return Math.min(100, Math.max(0, score));
};

// Load all farmer crop data from localStorage - REAL DATA
export const loadAllFarmerCrops = (): MarketplaceCrop[] => {
  try {
    const allCrops: MarketplaceCrop[] = [];
    
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Find all farmer database keys
    const farmerKeys = keys.filter(key => key.startsWith('farmer_database_'));
    
    console.log(`🔍 Found ${farmerKeys.length} farmer databases in localStorage`);
    console.log('📋 Farmer database keys:', farmerKeys);
    
    farmerKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const farmerData = JSON.parse(data);
          
          if (farmerData.crops && Array.isArray(farmerData.crops)) {
            console.log(`📊 Loading ${farmerData.crops.length} crops from farmer ${farmerData.farmerId} (${farmerData.farmerName})`);
            console.log(`🌾 Farmer crops:`, farmerData.crops.map(crop => ({
              id: crop.id,
              name: crop.name,
              type: crop.type,
              price: crop.price,
              farmerName: crop.farmerName
            })));
            
            farmerData.crops.forEach((crop: CropData, index: number) => {
              // Create unique ID for each crop to avoid duplicates
              const uniqueCropId = `${farmerData.farmerId}_${crop.id}_${index}_${Date.now()}`;
              
              // Create farmer info from actual data
              const farmer: FarmerData = {
                id: farmerData.farmerId,
                name: crop.farmerName || farmerData.farmerName || 'Unknown Farmer',
                phone: farmerData.farmerPhone || '+91-XXXX-XXXX',
                location: crop.location || farmerData.farmerLocation || 'Unknown Location',
                rating: Math.random() * 2 + 3, // Random rating between 3-5
                totalCrops: farmerData.totalCrops || 1,
                joinedDate: farmerData.lastUpdated || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                avatar: undefined
              };
              
              // Calculate additional marketplace data
              const marketplaceCrop: MarketplaceCrop = {
                ...crop,
                id: uniqueCropId, // Use unique ID
                farmer,
                distance: Math.random() * 50 + 1, // Random distance 1-50 km
                demandScore: calculateDemandScore(crop), // Real demand score based on crop data
                priceComparison: {
                  marketAverage: crop.price * (0.8 + Math.random() * 0.4), // ±20% variation
                  isAboveAverage: Math.random() > 0.5,
                  percentageDifference: (Math.random() - 0.5) * 40 // ±20% difference
                }
              };
              
              allCrops.push(marketplaceCrop);
            });
          }
        }
      } catch (error) {
        console.error('Error parsing farmer data:', error);
      }
    });
    
    console.log(`🌾 Total crops loaded for marketplace: ${allCrops.length}`);
    console.log('🌾 All marketplace crops:', allCrops.map(crop => ({
      id: crop.id,
      name: crop.name,
      farmerName: crop.farmer.name,
      price: crop.price,
      type: crop.type
    })));
    
    // Sort by demand score and recency
    return allCrops.sort((a, b) => {
      // First by demand score (higher is better)
      if (b.demandScore !== a.demandScore) {
        return b.demandScore - a.demandScore;
      }
      // Then by recency (newer is better)
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
    
  } catch (error) {
    console.error('Error loading farmer crops:', error);
    return [];
  }
};

// Filter crops by category
export const filterCropsByCategory = (crops: MarketplaceCrop[], category: string): MarketplaceCrop[] => {
  if (!category || category === 'all') return crops;
  
  return crops.filter(crop => {
    const cropType = crop.type.toLowerCase();
    const categoryLower = category.toLowerCase();
    
    switch (categoryLower) {
      case 'grains':
        return ['rice', 'wheat', 'maize', 'barley', 'millet'].includes(cropType);
      case 'vegetables':
        return ['tomato', 'onion', 'potato', 'carrot', 'cabbage', 'cauliflower'].includes(cropType);
      case 'fruits':
        return ['apple', 'banana', 'mango', 'orange', 'grapes', 'pomegranate'].includes(cropType);
      case 'pulses':
        return ['lentil', 'chickpea', 'black gram', 'green gram', 'pigeon pea'].includes(cropType);
      case 'spices':
        return ['turmeric', 'chili', 'coriander', 'cumin', 'cardamom'].includes(cropType);
      default:
        return cropType.includes(categoryLower);
    }
  });
};

// Search crops by name or type
export const searchCrops = (crops: MarketplaceCrop[], query: string): MarketplaceCrop[] => {
  if (!query.trim()) return crops;
  
  const searchTerm = query.toLowerCase();
  return crops.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm) ||
    crop.type.toLowerCase().includes(searchTerm) ||
    crop.variety.toLowerCase().includes(searchTerm) ||
    crop.location.toLowerCase().includes(searchTerm) ||
    crop.farmer.name.toLowerCase().includes(searchTerm)
  );
};

// Sort crops by different criteria
export const sortCrops = (crops: MarketplaceCrop[], sortBy: string): MarketplaceCrop[] => {
  const sortedCrops = [...crops];
  
  switch (sortBy) {
    case 'price-low':
      return sortedCrops.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedCrops.sort((a, b) => b.price - a.price);
    case 'distance':
      return sortedCrops.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    case 'rating':
      return sortedCrops.sort((a, b) => b.farmer.rating - a.farmer.rating);
    case 'demand':
      return sortedCrops.sort((a, b) => b.demandScore - a.demandScore);
    case 'recent':
      return sortedCrops.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    default:
      return sortedCrops;
  }
};

// Get crop categories for filtering
export const getCropCategories = (): { value: string; label: string; count: number }[] => {
  const crops = loadAllFarmerCrops();
  const categories = new Map<string, number>();
  
  crops.forEach(crop => {
    const type = crop.type.toLowerCase();
    let category = 'other';
    
    if (['rice', 'wheat', 'maize', 'barley', 'millet'].includes(type)) {
      category = 'grains';
    } else if (['tomato', 'onion', 'potato', 'carrot', 'cabbage', 'cauliflower'].includes(type)) {
      category = 'vegetables';
    } else if (['apple', 'banana', 'mango', 'orange', 'grapes', 'pomegranate'].includes(type)) {
      category = 'fruits';
    } else if (['lentil', 'chickpea', 'black gram', 'green gram', 'pigeon pea'].includes(type)) {
      category = 'pulses';
    } else if (['turmeric', 'chili', 'coriander', 'cumin', 'cardamom'].includes(type)) {
      category = 'spices';
    }
    
    categories.set(category, (categories.get(category) || 0) + 1);
  });
  
  return Array.from(categories.entries()).map(([value, count]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
    count
  }));
};

// Get marketplace statistics
export const getMarketplaceStats = () => {
  const crops = loadAllFarmerCrops();
  
  return {
    totalCrops: crops.length,
    totalFarmers: new Set(crops.map(crop => crop.farmerId)).size,
    averagePrice: crops.length > 0 ? crops.reduce((sum, crop) => sum + crop.price, 0) / crops.length : 0,
    categories: getCropCategories(),
    topSellingCrops: getTopSellingCrops(crops),
    priceRange: {
      min: crops.length > 0 ? Math.min(...crops.map(crop => crop.price)) : 0,
      max: crops.length > 0 ? Math.max(...crops.map(crop => crop.price)) : 0
    }
  };
};

// Get top selling crops
const getTopSellingCrops = (crops: MarketplaceCrop[]) => {
  const cropCounts = new Map<string, number>();
  
  crops.forEach(crop => {
    const name = crop.name.toLowerCase();
    cropCounts.set(name, (cropCounts.get(name) || 0) + 1);
  });
  
  return Array.from(cropCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
};

export type { MarketplaceCrop, FarmerData, CropData };
