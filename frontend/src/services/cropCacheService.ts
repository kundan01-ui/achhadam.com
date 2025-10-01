/**
 * Crop Cache Service
 *
 * Smart caching strategy for farmer crops:
 * - Same device: Instant load from localStorage
 * - Different device: Fetch from database, then cache
 * - Background sync: Always checks for updates
 * - Offline support: Works without internet
 */

export interface CachedCrop {
  _id: string;
  cropName: string;
  quantity: string;
  price: string;
  location: string;
  uploadedAt: string;
  farmerName?: string;
  farmerPhone?: string;
  [key: string]: any;
}

interface CacheMetadata {
  userId: string;
  phone: string;
  lastSync: number;
  deviceId: string;
  cropsCount: number;
}

class CropCacheService {
  private CACHE_KEY = 'farmer_crops_cache';
  private META_KEY = 'farmer_crops_meta';
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private deviceId: string;

  constructor() {
    // Generate unique device ID
    this.deviceId = this.getOrCreateDeviceId();
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Save crops to cache with metadata
   */
  saveCropsToCache(crops: CachedCrop[], userId: string, phone: string): void {
    try {
      console.log(`💾 Saving ${crops.length} crops to cache for user ${userId}`);

      const metadata: CacheMetadata = {
        userId,
        phone,
        lastSync: Date.now(),
        deviceId: this.deviceId,
        cropsCount: crops.length
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(crops));
      localStorage.setItem(this.META_KEY, JSON.stringify(metadata));

      console.log(`✅ Cache saved: ${crops.length} crops at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('❌ Failed to save crops to cache:', error);
    }
  }

  /**
   * Get crops from cache
   * Returns null if cache is invalid or expired
   */
  getCropsFromCache(userId: string, phone: string): CachedCrop[] | null {
    try {
      const metaStr = localStorage.getItem(this.META_KEY);
      const cropsStr = localStorage.getItem(this.CACHE_KEY);

      if (!metaStr || !cropsStr) {
        console.log('📭 No cache found');
        return null;
      }

      const metadata: CacheMetadata = JSON.parse(metaStr);
      const crops: CachedCrop[] = JSON.parse(cropsStr);

      // Validate cache belongs to current user
      if (metadata.userId !== userId && metadata.phone !== phone) {
        console.log('🔄 Cache is for different user, clearing...');
        this.clearCache();
        return null;
      }

      // Check if cache is fresh
      const age = Date.now() - metadata.lastSync;
      const isFresh = age < this.CACHE_DURATION;

      console.log(`📦 Cache found: ${crops.length} crops, age: ${Math.round(age/1000)}s, fresh: ${isFresh}`);
      console.log(`📱 Same device: ${metadata.deviceId === this.deviceId ? 'YES' : 'NO'}`);

      // Always return cache for instant display
      // Background sync will update if needed
      return crops;

    } catch (error) {
      console.error('❌ Failed to read crops from cache:', error);
      return null;
    }
  }

  /**
   * Check if cache needs refresh
   */
  needsRefresh(userId: string, phone: string): boolean {
    try {
      const metaStr = localStorage.getItem(this.META_KEY);
      if (!metaStr) return true;

      const metadata: CacheMetadata = JSON.parse(metaStr);

      // Different user = needs refresh
      if (metadata.userId !== userId && metadata.phone !== phone) {
        return true;
      }

      // Check age
      const age = Date.now() - metadata.lastSync;
      return age >= this.CACHE_DURATION;

    } catch (error) {
      return true;
    }
  }

  /**
   * Get cache age in seconds
   */
  getCacheAge(): number | null {
    try {
      const metaStr = localStorage.getItem(this.META_KEY);
      if (!metaStr) return null;

      const metadata: CacheMetadata = JSON.parse(metaStr);
      return Math.round((Date.now() - metadata.lastSync) / 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear cache (on logout or different user)
   */
  clearCache(): void {
    console.log('🗑️ Clearing crop cache');
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.META_KEY);
  }

  /**
   * Update single crop in cache
   */
  updateCropInCache(cropId: string, updatedCrop: Partial<CachedCrop>): void {
    try {
      const cropsStr = localStorage.getItem(this.CACHE_KEY);
      if (!cropsStr) return;

      const crops: CachedCrop[] = JSON.parse(cropsStr);
      const index = crops.findIndex(c => c._id === cropId);

      if (index !== -1) {
        crops[index] = { ...crops[index], ...updatedCrop };
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(crops));
        console.log(`✅ Updated crop ${cropId} in cache`);
      }
    } catch (error) {
      console.error('❌ Failed to update crop in cache:', error);
    }
  }

  /**
   * Add new crop to cache
   */
  addCropToCache(newCrop: CachedCrop): void {
    try {
      const cropsStr = localStorage.getItem(this.CACHE_KEY);
      const crops: CachedCrop[] = cropsStr ? JSON.parse(cropsStr) : [];

      // Add to beginning (most recent first)
      crops.unshift(newCrop);

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(crops));

      // Update metadata
      const metaStr = localStorage.getItem(this.META_KEY);
      if (metaStr) {
        const metadata: CacheMetadata = JSON.parse(metaStr);
        metadata.cropsCount = crops.length;
        metadata.lastSync = Date.now();
        localStorage.setItem(this.META_KEY, JSON.stringify(metadata));
      }

      console.log(`✅ Added new crop to cache, total: ${crops.length}`);
    } catch (error) {
      console.error('❌ Failed to add crop to cache:', error);
    }
  }

  /**
   * Remove crop from cache
   */
  removeCropFromCache(cropId: string): void {
    try {
      const cropsStr = localStorage.getItem(this.CACHE_KEY);
      if (!cropsStr) return;

      const crops: CachedCrop[] = JSON.parse(cropsStr);
      const filtered = crops.filter(c => c._id !== cropId);

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(filtered));

      // Update metadata
      const metaStr = localStorage.getItem(this.META_KEY);
      if (metaStr) {
        const metadata: CacheMetadata = JSON.parse(metaStr);
        metadata.cropsCount = filtered.length;
        metadata.lastSync = Date.now();
        localStorage.setItem(this.META_KEY, JSON.stringify(metadata));
      }

      console.log(`✅ Removed crop ${cropId} from cache, remaining: ${filtered.length}`);
    } catch (error) {
      console.error('❌ Failed to remove crop from cache:', error);
    }
  }
}

// Export singleton instance
export const cropCacheService = new CropCacheService();
