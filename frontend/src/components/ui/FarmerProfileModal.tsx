import React from 'react';
import { X, MapPin, Star, Package, Calendar, CheckCircle, Award } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    farmName?: string;
    location?: string;
    totalCrops?: number;
    joinedDate?: string;
  };
}

const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  farmer
}) => {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Farmer Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
              <span className="text-green-600 text-4xl font-bold">
                {farmer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{farmer.name}</h2>
            {farmer.farmName && (
              <p className="text-green-100 text-sm mt-1">{farmer.farmName}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Rating */}
          <div className="flex items-center justify-center gap-2 pb-4 border-b">
            <div className="flex items-center">
              {renderStars(farmer.rating)}
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {farmer.rating.toFixed(1)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {farmer.verified && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Verified Farmer</p>
                  <p className="text-xs text-blue-700">Government Authenticated</p>
                </div>
              </div>
            )}

            {farmer.location && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{farmer.location}</p>
                  <p className="text-xs text-gray-600">Farm Location</p>
                </div>
              </div>
            )}

            {farmer.totalCrops && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{farmer.totalCrops} Crops</p>
                  <p className="text-xs text-gray-600">Available Products</p>
                </div>
              </div>
            )}

            {farmer.joinedDate && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Member since {new Date(farmer.joinedDate).getFullYear()}
                  </p>
                  <p className="text-xs text-gray-600">Platform Experience</p>
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Trusted Seller</p>
                <p className="text-xs text-green-700">High Quality Products</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfileModal;