// UI Components Integration Guide
# 🎨 Google Maps UI Components - Integration Guide

## ✅ **All Components Created!**

### 📦 **Components Summary:**

#### 1. **Farmer Dashboard Components** (3 components)
- `AirQualityWidget.tsx` - Air quality monitoring
- `WeatherWidget.tsx` - Weather forecast
- `SolarPotentialCard.tsx` - Solar energy analysis

#### 2. **Buyer Dashboard Components** (2 components)
- `DeliveryCalculator.tsx` - Delivery cost calculator
- `NearbyMarketsPanel.tsx` - Markets finder

#### 3. **Transporter Dashboard Components** (1 component)
- `LiveNavigation.tsx` - Turn-by-turn navigation

#### 4. **Common Components** (1 component)
- `AddressAutocomplete.tsx` - Address search (all dashboards)

---

## 🚀 **Quick Integration**

### 1. **Farmer Dashboard Integration**

#### File: `frontend/src/pages/dashboard/FarmerDashboard.tsx`

```tsx
// Add imports at top
import AirQualityWidget from '../../components/farmer/AirQualityWidget';
import WeatherWidget from '../../components/farmer/WeatherWidget';
import SolarPotentialCard from '../../components/farmer/SolarPotentialCard';

// Inside FarmerDashboard component
function FarmerDashboard() {
  const [farmLocation, setFarmLocation] = useState({
    latitude: 30.7333, // Punjab (replace with actual farm location)
    longitude: 76.7794
  });

  return (
    <div className="farmer-dashboard">
      {/* Existing content */}

      {/* NEW: Environmental Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <AirQualityWidget location={farmLocation} />
        <WeatherWidget location={farmLocation} />
        <SolarPotentialCard location={farmLocation} />
      </div>

      {/* Rest of your dashboard */}
    </div>
  );
}
```

**Recommended Position:** Add after crop management section, before analytics

---

### 2. **Buyer Dashboard Integration**

#### File: `frontend/src/pages/dashboard/BuyerDashboard.tsx`

```tsx
// Add imports
import DeliveryCalculator from '../../components/buyer/DeliveryCalculator';
import NearbyMarketsPanel from '../../components/buyer/NearbyMarketsPanel';
import AddressAutocomplete from '../../components/common/AddressAutocomplete';

// Inside BuyerDashboard component
function BuyerDashboard() {
  const [buyerLocation, setBuyerLocation] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  return (
    <div className="buyer-dashboard">
      {/* Location Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Your Delivery Location</h3>
        <AddressAutocomplete
          onSelect={(location) => setBuyerLocation(location)}
          placeholder="Enter your delivery address..."
        />
      </div>

      {/* Existing crop browsing section */}
      <div className="crops-grid">
        {crops.map(crop => (
          <div key={crop.id} className="crop-card">
            {/* Existing crop info */}

            {/* NEW: Delivery Calculator */}
            <DeliveryCalculator
              farmLocation={crop.location}
              buyerLocation={buyerLocation}
              onCalculated={(details) => console.log('Delivery:', details)}
            />

            <button onClick={() => placeOrder(crop)}>
              Place Order
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* NEW: Nearby Markets */}
        {buyerLocation && (
          <NearbyMarketsPanel
            buyerLocation={buyerLocation}
            radius={5000}
          />
        )}
      </div>
    </div>
  );
}
```

**Recommended Position:**
- Address Autocomplete: Top of dashboard
- Delivery Calculator: Inside each crop card
- Nearby Markets: Right sidebar

---

### 3. **Transporter Dashboard Integration**

#### File: `frontend/src/pages/dashboard/TransporterDashboard.tsx`

```tsx
// Add import
import LiveNavigation from '../../components/transporter/LiveNavigation';

// Inside TransporterDashboard component
function TransporterDashboard() {
  const [activeDelivery, setActiveDelivery] = useState(null);

  // Get current delivery details
  const pickupLocation = activeDelivery?.farmLocation;
  const deliveryLocation = activeDelivery?.buyerLocation;

  return (
    <div className="transporter-dashboard">
      {/* Delivery List */}
      <div className="deliveries-list">
        {deliveries.map(delivery => (
          <div
            key={delivery.id}
            onClick={() => setActiveDelivery(delivery)}
          >
            {/* Delivery info */}
          </div>
        ))}
      </div>

      {/* Navigation Panel */}
      <div className="navigation-panel">
        {activeDelivery && pickupLocation && deliveryLocation ? (
          <LiveNavigation
            pickupLocation={pickupLocation}
            deliveryLocation={deliveryLocation}
          />
        ) : (
          <div className="empty-state">
            <p>Select a delivery to start navigation</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Recommended Position:** Full-screen navigation when delivery is active

---

## 📋 **Component Props Reference**

### AirQualityWidget
```typescript
interface Props {
  location: {
    latitude: number;
    longitude: number;
  };
}
```

### WeatherWidget
```typescript
interface Props {
  location: {
    latitude: number;
    longitude: number;
  };
}
```

### SolarPotentialCard
```typescript
interface Props {
  location: {
    latitude: number;
    longitude: number;
  };
}
```

### DeliveryCalculator
```typescript
interface Props {
  farmLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  buyerLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  onCalculated?: (details: any) => void;
}
```

### NearbyMarketsPanel
```typescript
interface Props {
  buyerLocation: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // default: 5000 meters
}
```

### LiveNavigation
```typescript
interface Props {
  pickupLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}
```

### AddressAutocomplete
```typescript
interface Props {
  onSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}
```

---

## 🎨 **Styling Notes**

All components use:
- **Tailwind CSS** classes
- **Lucide React** icons
- Responsive grid layouts
- Smooth animations

### Required Icon Imports:
```tsx
import {
  Wind, AlertTriangle, CheckCircle, XCircle,
  Cloud, Droplets, Thermometer, Sun,
  MapPin, Clock, DollarSign, Truck, RefreshCw,
  Navigation, TrendingUp, Store, Star,
  Search, X
} from 'lucide-react';
```

---

## 🔧 **Testing Each Component**

### Test Air Quality Widget:
```tsx
<AirQualityWidget
  location={{
    latitude: 30.7333, // Punjab
    longitude: 76.7794
  }}
/>
```

### Test Delivery Calculator:
```tsx
<DeliveryCalculator
  farmLocation={{
    latitude: 30.7333,
    longitude: 76.7794,
    address: "Farm, Punjab"
  }}
  buyerLocation={{
    latitude: 28.7041,
    longitude: 77.1025,
    address: "Delhi"
  }}
/>
```

### Test Live Navigation:
```tsx
<LiveNavigation
  pickupLocation={{
    latitude: 30.7333,
    longitude: 76.7794,
    address: "Farm Pickup"
  }}
  deliveryLocation={{
    latitude: 28.7041,
    longitude: 77.1025,
    address: "Customer Delivery"
  }}
/>
```

---

## 📱 **Responsive Design**

All components are mobile-responsive:

```css
/* Desktop: 3 columns */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Tablet: 2 columns */
grid-cols-1 md:grid-cols-2

/* Mobile: 1 column */
grid-cols-1
```

---

## 🚨 **Error Handling**

All components handle:
- ✅ Loading states (skeleton/spinner)
- ✅ Error messages
- ✅ Empty states
- ✅ Retry functionality
- ✅ Fallback data

Example error state:
```tsx
{error && (
  <div className="text-center text-sm text-red-600">
    {error}
    <button onClick={retry}>Try Again</button>
  </div>
)}
```

---

## ⚡ **Performance Tips**

### 1. Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

const AirQualityWidget = lazy(() => import('../../components/farmer/AirQualityWidget'));

<Suspense fallback={<LoadingSpinner />}>
  <AirQualityWidget location={farmLocation} />
</Suspense>
```

### 2. Memoization
```tsx
import { memo } from 'react';

export const AirQualityWidget = memo(({ location }) => {
  // Component code
});
```

### 3. Debouncing Address Input
Already implemented in AddressAutocomplete (waits for 3+ characters)

---

## 🔗 **Complete Integration Example**

### Full Farmer Dashboard with All Components:

```tsx
import React, { useState, useEffect } from 'react';
import AirQualityWidget from '../../components/farmer/AirQualityWidget';
import WeatherWidget from '../../components/farmer/WeatherWidget';
import SolarPotentialCard from '../../components/farmer/SolarPotentialCard';
import AddressAutocomplete from '../../components/common/AddressAutocomplete';

function FarmerDashboard() {
  const [farmLocation, setFarmLocation] = useState({
    latitude: 30.7333,
    longitude: 76.7794,
    address: 'Punjab, India'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-6">
        <h1 className="text-2xl font-bold">Farmer Dashboard</h1>

        {/* Farm Location Selector */}
        <div className="mt-4 max-w-md">
          <AddressAutocomplete
            onSelect={setFarmLocation}
            defaultValue={farmLocation.address}
            placeholder="Set your farm location..."
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Environmental Monitoring */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Environmental Monitoring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AirQualityWidget location={farmLocation} />
            <WeatherWidget location={farmLocation} />
            <SolarPotentialCard location={farmLocation} />
          </div>
        </section>

        {/* Existing Crop Management Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Crop Management</h2>
          {/* Your existing crops grid */}
        </section>
      </main>
    </div>
  );
}

export default FarmerDashboard;
```

---

## ✅ **Final Checklist**

Before going live:

- [ ] All components imported correctly
- [ ] Location data is real (not hardcoded)
- [ ] Error boundaries added
- [ ] Loading states tested
- [ ] Mobile responsiveness verified
- [ ] API keys configured in .env
- [ ] Analytics tracking enabled
- [ ] User feedback collected

---

## 🎉 **Summary**

### Created Components:
1. ✅ AirQualityWidget
2. ✅ WeatherWidget
3. ✅ SolarPotentialCard
4. ✅ DeliveryCalculator
5. ✅ NearbyMarketsPanel
6. ✅ LiveNavigation
7. ✅ AddressAutocomplete

### Integration Time:
- **Farmer Dashboard**: ~15 minutes
- **Buyer Dashboard**: ~20 minutes
- **Transporter Dashboard**: ~10 minutes

**Total: ~45 minutes for full integration!**

---

**🚀 Ready to integrate! Just copy-paste the code examples into your dashboards!**
