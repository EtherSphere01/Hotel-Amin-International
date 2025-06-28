'use client';
import React, { useState } from 'react';
import { Hotel, User, Bed, Calendar, Clock, Bell, Info, Star, MapPin, Phone, Mail, Wifi, Car, Utensils, Dumbbell, Waves, LogOut } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Stay"
          value="4"
          subtitle="nights remaining"
          icon={Bed}
          color="blue"
        />
        <StatCard
          title="Room Number"
          value="1205"
          subtitle="Ocean View Suite"
          icon={Hotel}
          color="green"
        />
        <StatCard
          title="Loyalty Points"
          value="2,850"
          subtitle="Gold Member"
          icon={User}
          color="purple"
        />
        <StatCard
          title="Total Amount"
          value="$1,200"
          subtitle="for current stay"
          icon={Calendar}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Stay Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">June 28, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">July 2, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Room Type:</span>
              <span className="font-medium">Deluxe Ocean View Suite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Nights:</span>
              <span className="font-medium">4</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">Sarah Johnson</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-sm">sarah.johnson@email.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">+1 (555) 123-4567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-medium">March 2020</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RoomDetailsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
          <span>Room 1205 - Deluxe Ocean View Suite</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium">Deluxe Ocean View Suite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Floor:</span>
                <span className="font-medium">12th Floor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">650 sq ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bed Type:</span>
                <span className="font-medium">King Size</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Occupancy:</span>
                <span className="font-medium">3 guests</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Photo</h3>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500">Room Photo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              "Ocean View Balcony",
              "King Size Bed",
              "Smart TV 55\"",
              "High-Speed WiFi",
              "Mini Bar",
              "Coffee Machine",
              "Air Conditioning",
              "Room Service",
              "Safe Box",
              "Marble Bathroom"
            ].map((amenity, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const HotelServicesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Hotel Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Concierge", hours: "24/7", location: "Lobby", icon: Bell },
            { name: "Spa & Wellness", hours: "6:00 AM - 10:00 PM", location: "2nd Floor", icon: User },
            { name: "Fitness Center", hours: "24/7", location: "3rd Floor", icon: Dumbbell },
            { name: "Swimming Pool", hours: "6:00 AM - 11:00 PM", location: "4th Floor", icon: Waves },
            { name: "Valet Parking", hours: "24/7", location: "Entrance", icon: Car },
            { name: "Business Center", hours: "24/7", location: "Mezzanine", icon: Info }
          ].map((service, index) => (
            <div key={index} className="flex items-center space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <service.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-lg">{service.name}</p>
                <p className="text-sm text-gray-600">{service.hours}</p>
                <p className="text-sm text-gray-500">{service.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'room-details':
        return <RoomDetailsTab />;
      case 'services':
        return <HotelServicesTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Hotel className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Hotel Amin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Sarah Johnson</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <TabButton
            id="overview"
            label="Overview"
            icon={User}
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="room-details"
            label="Room Details"
            icon={Bed}
            isActive={activeTab === 'room-details'}
            onClick={setActiveTab}
          />
          <TabButton
            id="services"
            label="Hotel Services"
            icon={Bell}
            isActive={activeTab === 'services'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default App;
