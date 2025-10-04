// Solar Potential Card for Farmer Dashboard
import React, { useState, useEffect } from 'react';
import { FarmerFeatures } from '../../services/googleMapsIntegrated';
import { Sun, Zap, TrendingUp, Info } from 'lucide-react';

interface SolarPotentialCardProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

export const SolarPotentialCard: React.FC<SolarPotentialCardProps> = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [solarData, setSolarData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchSolarPotential();
  }, [location]);

  const fetchSolarPotential = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await FarmerFeatures.getSolarPotential(location);

      if (result.success) {
        setSolarData(result);
      } else {
        setError('Solar data unavailable for this location');
      }
    } catch (error) {
      console.error('Solar API error:', error);
      setError('Unable to fetch solar data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !solarData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">Solar Potential</h3>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-700">
            {error || 'Solar analysis coming soon for your area'}
          </span>
        </div>
      </div>
    );
  }

  const sunshineHours = solarData.maxSunshineHours || 0;
  const panelConfigs = solarData.solarPanelConfigs || [];

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Solar Energy Potential
        </h3>
        <Zap className="w-6 h-6" />
      </div>

      {/* Main Metric */}
      <div className="mb-6">
        <div className="text-4xl font-bold">{sunshineHours.toLocaleString()}</div>
        <div className="text-sm opacity-90 mt-1">Sunshine Hours/Year</div>
      </div>

      {/* Solar Score */}
      <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">Solar Score</span>
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2"
              style={{ width: `${Math.min((sunshineHours / 3000) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold">
            {sunshineHours > 2500 ? 'Excellent' : sunshineHours > 2000 ? 'Good' : 'Fair'}
          </span>
        </div>
      </div>

      {/* Panel Recommendations */}
      {panelConfigs.length > 0 && (
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold mb-3">Recommended Setup:</h4>
          <div className="space-y-2">
            {panelConfigs.slice(0, 2).map((config: any, index: number) => (
              <div key={index} className="text-sm opacity-90">
                <div className="flex items-center justify-between">
                  <span>Option {index + 1}</span>
                  <span className="font-semibold">
                    {config.panelsCount || 0} panels
                  </span>
                </div>
                <div className="text-xs opacity-75">
                  Est. {(config.yearlyEnergyDcKwh || 0).toFixed(0)} kWh/year
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="bg-white bg-opacity-20 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2">Potential Benefits:</h4>
        <ul className="text-xs space-y-1 opacity-90">
          <li>• Reduce electricity costs</li>
          <li>• Power irrigation systems</li>
          <li>• Eco-friendly farming</li>
          <li>• Government subsidies available</li>
        </ul>
      </div>

      {/* CTA */}
      <button className="w-full mt-4 bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all">
        Get Solar Consultation
      </button>
    </div>
  );
};

export default SolarPotentialCard;
