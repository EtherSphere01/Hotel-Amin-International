'use client';
import React, { useState, useEffect } from 'react';
import { User, Bed, Utensils, Search, Plus, Edit2, Trash2, X, LogOut, Calendar, Menu, Ticket, Gift } from "lucide-react";

// API Base URL
const API_BASE_URL = 'http://localhost:3000';

const App = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'rooms' | 'food' | 'coupons' | 'offers'>('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [food, setFood] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    users: false,
    rooms: false,
    food: false,
    coupons: false,
    bookings: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    users: null,
    rooms: null,
    food: null,
    coupons: null,
    bookings: null
  });

  // Stats
  const [stats, setStats] = useState({
    availableRooms: 0,
    occupiedRooms: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    activeOffers: 0,
    expiredOffers: 0,
    todayRevenue: 0
  });

  // Fetch data functions
  const fetchRooms = async () => {
    setLoading(prev => ({ ...prev, rooms: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/room/all`);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      
      // Handle paginated response
      const roomsData = data.data || data;
      setRooms(roomsData);
      
      // Update room stats
      const available = roomsData.filter((room: any) => room.room_status === 'available').length;
      const occupied = roomsData.filter((room: any) => room.room_status === 'occupied').length;
      setStats(prev => ({ 
        ...prev, 
        availableRooms: available, 
        occupiedRooms: occupied 
      }));
      
      setErrors(prev => ({ ...prev, rooms: null }));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setErrors(prev => ({ ...prev, rooms: 'Failed to load rooms' }));
    } finally {
      setLoading(prev => ({ ...prev, rooms: false }));
    }
  };

  const fetchFood = async () => {
    setLoading(prev => ({ ...prev, food: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/restaurant/menu`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setFood(data);
      setErrors(prev => ({ ...prev, food: null }));
    } catch (error) {
      console.error('Error fetching menu:', error);
      setErrors(prev => ({ ...prev, food: 'Failed to load menu items' }));
    } finally {
      setLoading(prev => ({ ...prev, food: false }));
    }
  };

  const fetchCoupons = async () => {
    setLoading(prev => ({ ...prev, coupons: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/coupon/all`);
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      setCoupons(data);
      
      // Update coupon stats
      const active = data.filter((coupon: any) => coupon.is_active).length;
      const expired = data.filter((coupon: any) => !coupon.is_active).length;
      setStats(prev => ({ 
        ...prev, 
        activeCoupons: active, 
        expiredCoupons: expired 
      }));
      
      setErrors(prev => ({ ...prev, coupons: null }));
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setErrors(prev => ({ ...prev, coupons: 'Failed to load coupons' }));
    } finally {
      setLoading(prev => ({ ...prev, coupons: false }));
    }
  };

  const fetchBookings = async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/booking/all`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
      
      // Calculate revenue (simplified - today's bookings total)
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = data.filter((booking: any) => 
        booking.booking_date && booking.booking_date.startsWith(today)
      );
      const revenue = todayBookings.reduce((sum: number, booking: any) => 
        sum + (booking.total_price || 0), 0
      );
      setStats(prev => ({ ...prev, todayRevenue: revenue }));
      
      // Extract user data from bookings for guest management
      const guestsData = data.map((booking: any, index: number) => ({
        id: booking.booking_id || index + 1,
        name: `Guest ${booking.booking_id}`, // Since we don't have user names directly
        email: 'guest@hotel.com', // Placeholder
        phone: booking.user_phone || 'N/A',
        checkIn: booking.checkin_date ? new Date(booking.checkin_date).toLocaleDateString() : 'N/A',
        checkOut: booking.checkout_date ? new Date(booking.checkout_date).toLocaleDateString() : 'N/A',
        roomNumber: booking.rooms?.[0]?.room_num || 'N/A',
        status: booking.payment_status === 'paid' ? 'active' : 'pending'
      }));
      setUsers(guestsData);
      
      setErrors(prev => ({ ...prev, bookings: null }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrors(prev => ({ ...prev, bookings: 'Failed to load bookings' }));
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRooms();
    fetchFood();
    fetchCoupons();
    fetchBookings();
  }, []);

  // Refresh all data
  const refreshAllData = () => {
    fetchRooms();
    fetchFood();
    fetchCoupons();
    fetchBookings();
  };

  // Transform API data for display
  const transformRoomData = (apiRoom: any) => ({
    id: apiRoom.room_num,
    number: apiRoom.room_num.toString(),
    type: apiRoom.type || 'standard',
    price: parseFloat(apiRoom.room_price || 0),
    status: apiRoom.room_status,
    features: apiRoom.description || 'Standard amenities included'
  });

  const transformFoodData = (apiFood: any) => ({
    id: apiFood.food_id,
    name: apiFood.item_name,
    category: apiFood.food_type,
    price: parseFloat(apiFood.item_price || 0),
    description: apiFood.description || 'Delicious menu item',
    availability: apiFood.availability
  });

  const transformCouponData = (apiCoupon: any) => ({
    id: apiCoupon.coupon_id,
    code: apiCoupon.coupon_code,
    discount: apiCoupon.coupon_percent,
    type: 'percentage',
    description: `${apiCoupon.coupon_percent}% discount coupon`,
    validFrom: apiCoupon.created_at ? new Date(apiCoupon.created_at).toLocaleDateString() : 'N/A',
    validUntil: apiCoupon.expire_at ? new Date(apiCoupon.expire_at).toLocaleDateString() : 'N/A',
    status: apiCoupon.is_active ? 'active' : 'expired',
    usageCount: 0, // Not available in current API
    maxUsage: apiCoupon.quantity || 100
  });

  // Transformed data for rendering
  const displayRooms = rooms.map(transformRoomData);
  const displayFood = food.map(transformFoodData);
  const displayCoupons = coupons.map(transformCouponData);

  // Sample offers data (since no API endpoint exists yet)
  const offers = [
    { 
      id: 1, 
      title: 'Summer Paradise Package', 
      type: 'package', 
      description: 'Enjoy 3 nights with breakfast, spa access, and complimentary dinner', 
      price: 599, 
      originalPrice: 799, 
      discount: 25, 
      validFrom: '2024-06-01', 
      validUntil: '2024-08-31', 
      status: 'active',
      bookings: 24,
      features: ['3 Nights Stay', 'Daily Breakfast', 'Spa Access', 'Welcome Dinner', 'Airport Transfer']
    },
    { 
      id: 2, 
      title: 'Business Traveler Deal', 
      type: 'offer', 
      description: 'Special rates for business guests with meeting room access', 
      price: 189, 
      originalPrice: 249, 
      discount: 24, 
      validFrom: '2024-01-01', 
      validUntil: '2024-12-31', 
      status: 'active',
      bookings: 67,
      features: ['Business Room', 'Free WiFi', 'Meeting Room Access', 'Late Checkout', 'Business Center']
    },
    { 
      id: 3, 
      title: 'Romantic Getaway', 
      type: 'package', 
      description: 'Perfect package for couples with champagne and rose petals', 
      price: 459, 
      originalPrice: 599, 
      discount: 23, 
      validFrom: '2024-02-01', 
      validUntil: '2024-12-31', 
      status: 'active',
      bookings: 18,
      features: ['Deluxe Suite', 'Champagne', 'Rose Petals', 'Couple Spa', 'Romantic Dinner']
    },
    { 
      id: 4, 
      title: 'Winter Holiday Special', 
      type: 'offer', 
      description: 'Expired holiday package with festive decorations', 
      price: 299, 
      originalPrice: 399, 
      discount: 25, 
      validFrom: '2023-12-01', 
      validUntil: '2024-01-15', 
      status: 'expired',
      bookings: 45,
      features: ['Holiday Suite', 'Festive Decor', 'Hot Chocolate', 'Holiday Dinner', 'Gift Basket']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked-out': case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': case 'cleaning': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sidebarItems = [
    { key: 'users', label: 'User Management', icon: User, count: users.length },
    { key: 'rooms', label: 'Room Management', icon: Bed, count: displayRooms.length },
    { key: 'food', label: 'Food & Beverage', icon: Utensils, count: displayFood.length },
    { key: 'coupons', label: 'Coupon Management', icon: Ticket, count: displayCoupons.length },
    { key: 'offers', label: 'Offers & Packages', icon: Gift, count: offers.length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative z-50 lg:z-auto w-64 lg:w-68 transition-transform duration-300 bg-white shadow-xl border-r border-slate-200 flex flex-col h-full lg:h-auto overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-bold text-slate-800">Hotel Amin International</h1>
                <p className="text-xs text-slate-500">Management System</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key as 'users' | 'rooms' | 'food' | 'coupons' | 'offers');
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                activeTab === key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-auto">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-slate-200">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                     Welcome, Admin
                  </h1>
                  <p className="text-slate-600 mt-1 text-sm lg:text-base">Professional Dashboard System</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <button 
                  onClick={refreshAllData}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
                  title="Refresh all data"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block">
                  <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-4 lg:px-6 py-4 lg:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-4 mb-6 lg:mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-3 lg:p-4 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs lg:text-sm font-medium">Available Rooms</p>
                  <p className="text-xl lg:text-2xl font-bold text-slate-800 mt-1">{stats.availableRooms}</p>
                  <p className="text-amber-600 text-xs mt-1">{stats.occupiedRooms} occupied</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-3 lg:p-4 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs lg:text-sm font-medium">Active Coupons</p>
                  <p className="text-xl lg:text-2xl font-bold text-slate-800 mt-1">{stats.activeCoupons}</p>
                  <p className="text-orange-600 text-xs mt-1">{stats.expiredCoupons} expired</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-3 lg:p-4 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs lg:text-sm font-medium">Active Offers</p>
                  <p className="text-xl lg:text-2xl font-bold text-slate-800 mt-1">{offers.filter(o => o.status === 'active').length}</p>
                  <p className="text-purple-600 text-xs mt-1">{offers.filter(o => o.status === 'expired').length} expired</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-3 lg:p-4 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs lg:text-sm font-medium">Revenue Today</p>
                  <p className="text-xl lg:text-2xl font-bold text-slate-800 mt-1">${stats.todayRevenue.toLocaleString()}</p>
                  <p className="text-emerald-600 text-xs mt-1">↗ Real-time data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-4 lg:p-6">
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800">Guest Management</h2>
                      <p className="text-slate-600 mt-1">Manage hotel guests and their reservations</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search guests..."
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-5 h-5" />
                        <span>Add Guest</span>
                      </button>
                    </div>
                  </div>

                  {/* Users Table - Mobile responsive */}
                  <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                          <tr>
                            <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Guest Details</th>
                            <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider hidden md:table-cell">Contact Information</th>
                            <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Stay Period</th>
                            <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Room</th>
                            <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm lg:text-lg">
                                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                                    <div className="text-sm text-slate-500">ID: #{user.id.toString().padStart(4, '0')}</div>
                                    <div className="md:hidden text-xs text-slate-500 mt-1">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                <div className="text-sm text-slate-900 font-medium">{user.email}</div>
                                <div className="text-sm text-slate-500">{user.phone}</div>
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  <div>
                                    <div className="text-sm text-slate-900 font-medium">In: {user.checkIn}</div>
                                    <div className="text-sm text-slate-500">Out: {user.checkOut}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-slate-900 bg-slate-100 px-2 lg:px-3 py-1 rounded-lg inline-block">
                                  Room {user.roomNumber}
                                </div>
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 lg:px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-1 lg:space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1.5 lg:p-2 rounded-lg transition-colors">
                                    <Edit2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1.5 lg:p-2 rounded-lg transition-colors">
                                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Rooms Tab */}
              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800">Room Management</h2>
                      <p className="text-slate-600 mt-1">Manage hotel rooms and their availability</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search rooms..."
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-5 h-5" />
                        <span>Add Room</span>
                      </button>
                    </div>
                  </div>

                  {/* Rooms Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {loading.rooms ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">Loading rooms...</div>
                      </div>
                    ) : errors.rooms ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-red-600">{errors.rooms}</div>
                      </div>
                    ) : displayRooms.length === 0 ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">No rooms found</div>
                      </div>
                    ) : (
                      displayRooms.map((room) => (
                      <div key={room.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="p-4 lg:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
                                <Bed className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg lg:text-xl font-bold text-slate-800">Room {room.number}</h3>
                                <p className="text-slate-500 capitalize text-sm">{room.type} Room</p>
                              </div>
                            </div>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(room.status)}`}>
                              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Price per night</span>
                              <span className="text-xl lg:text-2xl font-bold text-slate-800">${room.price}</span>
                            </div>
                            
                            <div>
                              <p className="text-slate-600 text-sm mb-2">Features:</p>
                              <p className="text-slate-700 text-sm leading-relaxed">{room.features}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 mt-4 pt-4 border-t border-slate-100">
                            <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Food Tab */}
              {activeTab === 'food' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800">Food & Beverage</h2>
                      <p className="text-slate-600 mt-1">Manage restaurant menu and food services</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search menu items..."
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-5 h-5" />
                        <span>Add Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Food Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {loading.food ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">Loading menu items...</div>
                      </div>
                    ) : errors.food ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-red-600">{errors.food}</div>
                      </div>
                    ) : displayFood.length === 0 ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">No menu items found</div>
                      </div>
                    ) : (
                      displayFood.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="p-4 lg:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
                                  <Utensils className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-base lg:text-lg font-bold text-slate-800">{item.name}</h3>
                                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full capitalize">
                                    {item.category}
                                  </span>
                                </div>
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed mb-3">{item.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-xl lg:text-2xl font-bold text-slate-800">${item.price}</div>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                              item.availability 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                              {item.availability ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2 pt-4 border-t border-slate-100">
                            <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === 'coupons' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800">Coupon Management</h2>
                      <p className="text-slate-600 mt-1">Manage discount coupons and promotional codes</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search coupons..."
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2.5 rounded-xl hover:from-orange-700 hover:to-orange-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-5 h-5" />
                        <span>Add Coupon</span>
                      </button>
                    </div>
                  </div>

                  {/* Coupons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {loading.coupons ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">Loading coupons...</div>
                      </div>
                    ) : errors.coupons ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-red-600">{errors.coupons}</div>
                      </div>
                    ) : displayCoupons.length === 0 ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">No coupons found</div>
                      </div>
                    ) : (
                      displayCoupons.map((coupon) => (
                      <div key={coupon.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="p-4 lg:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
                                  <Ticket className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-base lg:text-lg font-bold text-slate-800">{coupon.code}</h3>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold text-orange-600">
                                      {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {coupon.type === 'percentage' ? 'OFF' : 'DISCOUNT'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed mb-3">{coupon.description}</p>
                            </div>
                          </div>
                          
                          {/* Validity Period */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Valid From:</span>
                              <span className="text-slate-700 font-medium">{coupon.validFrom}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Valid Until:</span>
                              <span className="text-slate-700 font-medium">{coupon.validUntil}</span>
                            </div>
                          </div>

                          {/* Usage Statistics */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-slate-500">Usage:</span>
                              <span className="text-slate-700 font-medium">{coupon.usageCount}/{coupon.maxUsage}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min((coupon.usageCount / coupon.maxUsage) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                              coupon.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : coupon.status === 'expired'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}>
                              {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2 pt-4 border-t border-slate-100">
                            <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Offers & Packages Tab */}
              {activeTab === 'offers' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800">Offers & Packages</h2>
                      <p className="text-slate-600 mt-1">Manage special offers and vacation packages</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search offers and packages..."
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-5 h-5" />
                        <span>Add Offer</span>
                      </button>
                    </div>
                  </div>

                  {/* Offers Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {offers.map((offer) => (
                      <div key={offer.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="p-4 lg:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
                                  <Gift className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-slate-800">{offer.title}</h3>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      offer.type === 'package' 
                                        ? 'bg-purple-100 text-purple-700' 
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {offer.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                      {offer.discount}% OFF
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed mb-3">{offer.description}</p>
                            </div>
                          </div>
                          
                          {/* Pricing */}
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="text-2xl font-bold text-slate-800">${offer.price}</div>
                            <div className="text-sm text-slate-500 line-through">${offer.originalPrice}</div>
                            <div className="text-sm font-medium text-emerald-600">
                              Save ${offer.originalPrice - offer.price}
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-slate-700 mb-2">Includes:</p>
                            <div className="grid grid-cols-1 gap-1">
                              {offer.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                  <span>{feature}</span>
                                </div>
                              ))}
                              {offer.features.length > 3 && (
                                <div className="text-xs text-slate-500 mt-1">
                                  +{offer.features.length - 3} more features
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Validity & Stats */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Valid From:</span>
                              <span className="text-slate-700 font-medium">{offer.validFrom}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Valid Until:</span>
                              <span className="text-slate-700 font-medium">{offer.validUntil}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Bookings:</span>
                              <span className="text-slate-700 font-medium">{offer.bookings} guests</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                              offer.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : offer.status === 'expired'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}>
                              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2 pt-4 border-t border-slate-100">
                            <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
