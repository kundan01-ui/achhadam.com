import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Truck, TrendingUp, Package, MapPin, Star, Clock, Route, DollarSign } from 'lucide-react';

const TransporterDashboard: React.FC = () => {
  const mockData = {
    totalDeliveries: 156,
    totalEarnings: 450000,
    activeDeliveries: 8,
    vehicles: 3,
    averageRating: 4.7,
    activeDeliveriesList: [
      { id: 1, from: 'Gujarat', to: 'Mumbai', crop: 'Cotton', quantity: '50 tons', status: 'In Transit', eta: '2 hours' },
      { id: 2, from: 'Punjab', to: 'Delhi', crop: 'Wheat', quantity: '100 tons', status: 'Loading', eta: '4 hours' },
      { id: 3, from: 'Karnataka', to: 'Chennai', crop: 'Rice', quantity: '75 tons', status: 'In Transit', eta: '6 hours' }
    ],
    vehicleStatus: [
      { id: 1, type: 'Truck', capacity: '25 tons', status: 'Available', location: 'Mumbai' },
      { id: 2, type: 'Trailer', capacity: '40 tons', status: 'In Transit', location: 'Punjab' },
      { id: 3, type: 'Mini Truck', capacity: '10 tons', status: 'Maintenance', location: 'Gujarat' }
    ],
    upcomingSchedules: [
      { id: 1, date: '2024-02-15', from: 'Gujarat', to: 'Mumbai', crop: 'Cotton', quantity: '50 tons' },
      { id: 2, date: '2024-02-16', from: 'Punjab', to: 'Delhi', crop: 'Wheat', quantity: '100 tons' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transporter Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your delivery overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{mockData.totalDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{mockData.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{mockData.activeDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{mockData.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Active Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.activeDeliveriesList.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{delivery.crop}</h4>
                      <p className="text-sm text-gray-600">{delivery.quantity} • {delivery.from} → {delivery.to}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        delivery.status === 'Loading' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {delivery.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">ETA: {delivery.eta}</p>
                      <Button variant="outline" size="sm">
                        Track
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Status */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.vehicleStatus.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{vehicle.type}</h4>
                      <p className="text-sm text-gray-600">{vehicle.capacity} • {vehicle.location}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Schedules */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Upcoming Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockData.upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{schedule.crop}</h4>
                    <p className="text-sm text-gray-600">{schedule.quantity} • {schedule.from} → {schedule.to}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {schedule.date}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="w-full">
                <Route className="w-4 h-4 mr-2" />
                Accept New Load
              </Button>
              <Button variant="outline" className="w-full">
                <Truck className="w-4 h-4 mr-2" />
                Manage Vehicles
              </Button>
              <Button variant="outline" className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                View Earnings
              </Button>
              <Button variant="outline" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Route Planning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransporterDashboard;
