'use client';
import React from 'react';
import { Hotel, User, Bed, Calendar, Clock, Bell, Info, Star, MapPin, Phone, Mail, Wifi, Car, Utensils, Dumbbell, Waves } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hotel Amin International</h1>
                <p className="text-gray-600 font-medium">Welcome back, Sarah Johnson</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <Clock size={18} />
                <span className="font-medium">June 28, 2024</span>
              </div>
              <div className="relative">
                <div className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">
                  <Bell className="text-blue-600" size={20} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Current Stay</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">4</p>
                <p className="text-gray-400 text-sm mt-1">nights remaining</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Bed className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Room Number</p>
                <p className="text-3xl font-bold text-green-600 mt-2">1205</p>
                <p className="text-gray-400 text-sm mt-1">Ocean View Suite</p>
              </div>
              <div className="p-4 bg-green-100 rounded-2xl">
                <Hotel className="text-green-600" size={28} />
              </div>
            </div>
          </div>

         

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Amount</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">$1,200</p>
                <p className="text-gray-400 text-sm mt-1">for current stay</p>
              </div>
              <div className="p-4 bg-orange-100 rounded-2xl">
                <Calendar className="text-orange-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Room Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Room 1205 - Deluxe Ocean View Suite</h2>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Room Type</span>
                    <span className="font-semibold text-gray-800">Deluxe Ocean View Suite</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Floor</span>
                    <span className="font-semibold text-gray-800">12th Floor</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Size</span>
                    <span className="font-semibold text-gray-800">650 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">Max Occupancy</span>
                    <span className="font-semibold text-gray-800">3 guests</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 font-medium">Room Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Room Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "Ocean View Balcony", icon: MapPin },
                    { name: "King Size Bed", icon: Bed },
                    { name: "Smart TV 55\"", icon: Info },
                    { name: "High-Speed WiFi", icon: Wifi },
                    { name: "Mini Bar", icon: Utensils },
                    { name: "Coffee Machine", icon: Utensils },
                    { name: "Air Conditioning", icon: Info },
                    { name: "Room Service", icon: Bell },
                    { name: "Safe Box", icon: Info },
                    { name: "Marble Bathroom", icon: Info }
                  ].map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <amenity.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Food Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Food & Dining Services</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    name: "Ocean Breeze Restaurant",
                    cuisine: "International",
                    hours: "6:00 AM - 11:00 PM",
                    location: "Ground Floor",
                    rating: 4.8,
                    specialties: ["Fresh Seafood", "Steaks", "Vegetarian Options"]
                  },
                  {
                    name: "Sky Lounge",
                    cuisine: "Bar & Grill",
                    hours: "5:00 PM - 2:00 AM",
                    location: "Rooftop - 25th Floor",
                    rating: 4.6,
                    specialties: ["Cocktails", "Appetizers", "City Views"]
                  },
                  {
                    name: "Café Sunrise",
                    cuisine: "Café & Bakery",
                    hours: "5:30 AM - 3:00 PM",
                    location: "Lobby Level",
                    rating: 4.7,
                    specialties: ["Fresh Pastries", "Coffee", "Light Meals"]
                  }
                ].map((restaurant, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-600">{restaurant.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Utensils className="w-4 h-4" />
                        <span>{restaurant.cuisine}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.hours}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Order */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Order</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Order #ORD-001</p>
                    <p className="text-sm text-gray-600 mt-1">Ocean Breeze Restaurant</p>
                    <p className="text-sm text-gray-600">Grilled Salmon, Caesar Salad, Chocolate Cake</p>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm rounded-full font-medium mb-2">
                      Preparing
                    </div>
                    <p className="text-sm text-gray-600">ETA: 25 minutes</p>
                    <p className="font-semibold text-gray-800">$85.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Info & Services */}
          <div className="space-y-8">
            
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">Sarah Johnson</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">sarah.johnson@email.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Star className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">Membership</p>
                    <p className="font-medium text-purple-800">Gold Member since March 2020</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Stay Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Current Stay</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium text-gray-800">June 28, 2024</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium text-gray-800">July 2, 2024</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Nights</span>
                  <span className="font-medium text-gray-800">4 nights</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-green-600">$1,200</span>
                </div>
              </div>
            </div>

            {/* Hotel Services */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Hotel Services</h3>
              <div className="space-y-3">
                {[
                  { name: "Concierge", hours: "24/7", location: "Lobby", icon: Bell },
                  { name: "Spa & Wellness", hours: "6:00 AM - 10:00 PM", location: "2nd Floor", icon: User },
                  { name: "Fitness Center", hours: "24/7", location: "3rd Floor", icon: Dumbbell },
                  { name: "Swimming Pool", hours: "6:00 AM - 11:00 PM", location: "4th Floor", icon: Waves },
                  { name: "Valet Parking", hours: "24/7", location: "Entrance", icon: Car },
                  { name: "Business Center", hours: "24/7", location: "Mezzanine", icon: Info }
                ].map((service, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <service.icon className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.hours} • {service.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
