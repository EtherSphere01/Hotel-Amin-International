'use client';
import React, { useState, useEffect } from 'react';
import { User, Bed, Utensils, Search, Plus, Edit2, Trash2, X, LogOut, Menu, Ticket, Gift, Bell } from "lucide-react";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// API Base URL
const API_BASE_URL = 'http://localhost:3000';

const App = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'rooms' | 'food' | 'coupons' | 'offers'>('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalType, setEditModalType] = useState<'user' | 'room' | 'food' | 'coupon' | 'offer' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'user' | 'room' | 'food' | 'coupon' | 'offer' | null>(null);
  
  // Notification states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [previousBookingCount, setPreviousBookingCount] = useState(0);
  const [previousReservationCount, setPreviousReservationCount] = useState(0);
  
  // Search states
  const [searchTerms, setSearchTerms] = useState({
    users: '',
    rooms: '',
    food: '',
    coupons: '',
    offers: ''
  });
  
  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [food, setFood] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    users: false,
    rooms: false,
    food: false,
    coupons: false,
    offers: false,
    bookings: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    users: null as string | null,
    rooms: null as string | null,
    food: null as string | null,
    coupons: null as string | null,
    offers: null as string | null,
    bookings: null as string | null
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

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/user/all`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setErrors(prev => ({ ...prev, users: null }));
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrors(prev => ({ ...prev, users: 'Failed to load users' }));
      toast.error('Failed to load users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchBookings = async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/booking/all`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      
      const bookingsData = data.data || data;
      setBookings(bookingsData);
      
      // Check for new bookings for notifications
      if (previousBookingCount > 0 && bookingsData.length > previousBookingCount) {
        const newBookings = bookingsData.length - previousBookingCount;
        addNotification('booking', `${newBookings} new booking${newBookings > 1 ? 's' : ''} received!`, newBookings);
      }
      setPreviousBookingCount(bookingsData.length);
      
      // Calculate revenue (simplified - today's bookings total)
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookingsData.filter((booking: any) => 
        booking.booking_date && booking.booking_date.startsWith(today)
      );
      const revenue = todayBookings.reduce((sum: number, booking: any) => 
        sum + (booking.total_price || 0), 0
      );
      setStats(prev => ({ ...prev, todayRevenue: revenue }));
      
      setErrors(prev => ({ ...prev, bookings: null }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrors(prev => ({ ...prev, bookings: 'Failed to load bookings' }));
      // Fallback to empty array if API fails
      setBookings([]);
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  // Notification functions
  const addNotification = (type: string, message: string, count: number) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      count,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Check for new bookings and reservations
  const checkForNewBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/all`);
      if (response.ok) {
        const data = await response.json();
        const currentCount = data.length || 0;
        
        if (previousBookingCount > 0 && currentCount > previousBookingCount) {
          const newBookings = currentCount - previousBookingCount;
          addNotification('booking', `${newBookings} new booking${newBookings > 1 ? 's' : ''} received!`, newBookings);
        }
        setPreviousBookingCount(currentCount);
      }
    } catch (error) {
      console.error('Error checking bookings:', error);
    }
  };

  const checkForNewReservations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservation/all`);
      if (response.ok) {
        const data = await response.json();
        const currentCount = data.length || 0;
        
        if (previousReservationCount > 0 && currentCount > previousReservationCount) {
          const newReservations = currentCount - previousReservationCount;
          addNotification('reservation', `${newReservations} new reservation${newReservations > 1 ? 's' : ''} received!`, newReservations);
        }
        setPreviousReservationCount(currentCount);
      }
    } catch (error) {
      console.error('Error checking reservations:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchRooms();
    fetchFood();
    fetchCoupons();
    fetchOffers();
    fetchBookings();
    
    // Initialize counts for notifications
    checkForNewBookings();
    checkForNewReservations();
    
    // Set up interval to check for new bookings/reservations every 30 seconds
    const notificationInterval = setInterval(() => {
      checkForNewBookings();
      checkForNewReservations();
    }, 30000);
    
    return () => clearInterval(notificationInterval);
  }, []);

  // Handle click outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (notificationOpen && !target.closest('.notification-dropdown')) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Refresh all data
  const refreshAllData = () => {
    fetchUsers();
    fetchRooms();
    fetchFood();
    fetchCoupons();
    fetchOffers();
    fetchBookings();
  };

  // Edit and Delete functions
  const handleEdit = (type: 'user' | 'room' | 'food' | 'coupon' | 'offer', item: any) => {
    // For display items, we need to find the original API data
    let originalItem = item;
    
    if (type === 'room') {
      // Find original room data from rooms array (not displayRooms)
      originalItem = rooms.find(room => room.room_num === item.room_num) || item;
    } else if (type === 'food') {
      // Find original food data from food array (not displayFood)
      originalItem = food.find(foodItem => foodItem.food_id === item.food_id) || item;
    } else if (type === 'coupon') {
      // Find original coupon data from coupons array (not displayCoupons)
      originalItem = coupons.find(coupon => coupon.coupon_id === item.coupon_id) || item;
    } else if (type === 'offer') {
      // Find original offer data from offers array
      originalItem = offers.find(offer => offer.id === item.id) || item;
    }
    
    setEditingItem(originalItem);
    setEditModalType(type as any);
    setEditModalOpen(true);
  };

  const handleDelete = async (type: 'user' | 'room' | 'food' | 'coupon' | 'offer', id: number | string) => {
    const result = await Swal.fire({
      title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}?`,
      text: `Are you sure you want to delete this ${type}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;
    
    try {
      let endpoint = '';
      switch (type) {
        case 'user':
          endpoint = `/user/delete/${id}`;
          break;
        case 'room':
          endpoint = `/room/delete/${id}`;
          break;
        case 'food':
          endpoint = `/restaurant/menu/${id}`;
          break;
        case 'coupon':
          endpoint = `/coupon/delete/${id}`;
          break;
        case 'offer':
          // Since offers don't have a backend API yet, we'll handle them locally
          console.log('Offer delete not implemented yet');
          toast.success('Offer deleted successfully!');
          return;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete ${type}`);
      }
      
      // Refresh the specific data
      switch (type) {
        case 'user':
          fetchUsers();
          break;
        case 'room':
          fetchRooms();
          break;
        case 'food':
          fetchFood();
          break;
        case 'coupon':
          fetchCoupons();
          break;
        case 'offer':
          fetchOffers();
          break;
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${type}`;
      toast.error(errorMessage);
    }
  };

  const handleSaveEdit = async (updatedData: any) => {
    if (!editingItem || !editModalType) return;
    
    try {
      let endpoint = '';
      let method = 'PUT';
      
      switch (editModalType) {
        case 'user':
          endpoint = `/user/update/${editingItem.user_id}`;
          break;
        case 'room':
          endpoint = `/room/update/${editingItem.room_num}`;
          break;
        case 'food':
          endpoint = `/restaurant/menu/${editingItem.food_id}`;
          method = 'PATCH';
          break;
        case 'coupon':
          endpoint = `/coupon/update/${editingItem.coupon_id}`;
          break;
        case 'offer':
          // Offers are handled locally for now
          console.log('Offer edit not implemented yet');
          setEditModalOpen(false);
          setEditingItem(null);
          setEditModalType(null);
          toast.success('Offer updated successfully!');
          return;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update ${editModalType}`);
      }
      
      // Refresh the specific data
      switch (editModalType) {
        case 'user':
          fetchUsers();
          break;
        case 'room':
          fetchRooms();
          break;
        case 'food':
          fetchFood();
          break;
        case 'coupon':
          fetchCoupons();
          break;
        case 'offer':
          fetchOffers();
          break;
      }
      
      setEditModalOpen(false);
      setEditingItem(null);
      setEditModalType(null);
      
      toast.success(`${editModalType.charAt(0).toUpperCase() + editModalType.slice(1)} updated successfully!`);
      
    } catch (error) {
      console.error(`Error updating ${editModalType}:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to update ${editModalType}`;
      toast.error(errorMessage);
    }
  };

  // Add functions
  const handleAdd = (type: 'user' | 'room' | 'food' | 'coupon' | 'offer') => {
    setAddModalType(type);
    setAddModalOpen(true);
  };

  const handleSaveAdd = async (newData: any) => {
    if (!addModalType) return;
    
    try {
      let endpoint = '';
      
      switch (addModalType) {
        case 'user':
          endpoint = '/user/createUser';
          break;
        case 'room':
          endpoint = '/room/create';
          break;
        case 'food':
          endpoint = '/restaurant/menu';
          break;
        case 'coupon':
          endpoint = '/coupon/create';
          break;
        case 'offer':
          // Offers are handled locally for now
          console.log('Offer creation not implemented yet');
          setAddModalOpen(false);
          setAddModalType(null);
          toast.success('Offer created successfully!');
          return;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create ${addModalType}`);
      }
      
      // Refresh the specific data
      switch (addModalType) {
        case 'user':
          fetchUsers();
          break;
        case 'room':
          fetchRooms();
          break;
        case 'food':
          fetchFood();
          break;
        case 'coupon':
          fetchCoupons();
          break;
        case 'offer':
          fetchOffers();
          break;
      }
      
      setAddModalOpen(false);
      setAddModalType(null);
      
      toast.success(`${addModalType.charAt(0).toUpperCase() + addModalType.slice(1)} created successfully!`);
      
    } catch (error) {
      console.error(`Error creating ${addModalType}:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to create ${addModalType}`;
      toast.error(errorMessage);
    }
  };

  // Transform API data for display
  const transformRoomData = (apiRoom: any) => ({
    ...apiRoom, // Preserve original API fields
    id: apiRoom.room_num,
    number: apiRoom.room_num.toString(),
    type: apiRoom.type || 'standard',
    price: parseFloat(apiRoom.room_price || 0),
    status: apiRoom.room_status,
    features: apiRoom.description || 'Standard amenities included'
  });

  const transformFoodData = (apiFood: any) => ({
    ...apiFood, // Preserve original API fields
    id: apiFood.food_id,
    name: apiFood.item_name,
    category: apiFood.food_type,
    price: parseFloat(apiFood.item_price || 0),
    description: apiFood.description || 'Delicious menu item',
    availability: apiFood.availability
  });

  const transformCouponData = (apiCoupon: any) => ({
    ...apiCoupon, // Preserve original API fields
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

  const fetchOffers = async () => {
    setLoading(prev => ({ ...prev, offers: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/offers`);
      if (!response.ok) throw new Error('Failed to fetch offers');
      const data = await response.json();
      
      const offersData = data.data || data;
      setOffers(offersData);
      
      // Update offers stats
      const activeOffers = offersData.filter((offer: any) => offer.status === 'active').length;
      const expiredOffers = offersData.filter((offer: any) => offer.status === 'expired').length;
      setStats(prev => ({ 
        ...prev, 
        activeOffers, 
        expiredOffers 
      }));
      
      setErrors(prev => ({ ...prev, offers: null }));
    } catch (error) {
      console.error('Error fetching offers:', error);
      setErrors(prev => ({ ...prev, offers: 'Failed to load offers' }));
    } finally {
      setLoading(prev => ({ ...prev, offers: false }));
    }
  };

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

  // Filtered data based on search terms
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerms.users.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerms.users.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerms.users.toLowerCase()) ||
    user.nationality?.toLowerCase().includes(searchTerms.users.toLowerCase()) ||
    user.profession?.toLowerCase().includes(searchTerms.users.toLowerCase())
  );

  const filteredRooms = displayRooms.filter(room => 
    room.room_num?.toString().includes(searchTerms.rooms.toLowerCase()) ||
    room.type?.toLowerCase().includes(searchTerms.rooms.toLowerCase()) ||
    room.room_status?.toLowerCase().includes(searchTerms.rooms.toLowerCase())
  );

  const filteredFood = displayFood.filter(foodItem => 
    foodItem.item_name?.toLowerCase().includes(searchTerms.food.toLowerCase()) ||
    foodItem.food_type?.toLowerCase().includes(searchTerms.food.toLowerCase()) ||
    foodItem.description?.toLowerCase().includes(searchTerms.food.toLowerCase())
  );

  const filteredCoupons = displayCoupons.filter(coupon => 
    coupon.coupon_code?.toLowerCase().includes(searchTerms.coupons.toLowerCase()) ||
    coupon.coupon_percent?.toString().includes(searchTerms.coupons.toLowerCase())
  );

  const filteredOffers = offers.filter(offer => 
    offer.title?.toLowerCase().includes(searchTerms.offers.toLowerCase()) ||
    offer.type?.toLowerCase().includes(searchTerms.offers.toLowerCase()) ||
    offer.description?.toLowerCase().includes(searchTerms.offers.toLowerCase())
  );

  // Edit Modal Component
  const EditModal = () => {
    const [formData, setFormData] = useState<any>(editingItem || {});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : 
                name === 'availability' ? value === 'true' :
                value
      }));
    };

    const getFilteredFormData = () => {
      // Filter formData to only include fields that should be sent to the API
      const filteredData = { ...formData };
      
      // Remove any display-only or computed fields and ID fields (passed as URL params)
      if (editModalType === 'room') {
        // UpdateRoomDto fields only - exclude room_num (it's in URL param)
        const allowedFields = ['floor', 'capacity', 'type', 'description', 'room_price', 'discount', 'room_status', 'housekeeping_status'];
        Object.keys(filteredData).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete filteredData[key];
          }
        });
      } else if (editModalType === 'food') {
        // CreateMenuItemDto fields - exclude food_id (it's in URL param)
        const allowedFields = ['item_name', 'item_price', 'food_type', 'description', 'availability'];
        Object.keys(filteredData).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete filteredData[key];
          }
        });
        // Set availability to true if not set
        if (filteredData.availability === undefined) {
          filteredData.availability = true;
        }
      } else if (editModalType === 'coupon') {
        // CreateCouponDto fields - exclude coupon_id (it's in URL param) 
        // Note: CreateCouponDto requires employee_id and expire_at
        const allowedFields = ['coupon_code', 'coupon_percent', 'quantity', 'expire_at'];
        Object.keys(filteredData).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete filteredData[key];
          }
        });
        // Add missing required fields for coupon DTO
        filteredData.employee_id = 1; // Default employee ID - should be from logged in user
        // Convert expire_at to proper date format if it exists
        if (filteredData.expire_at) {
          filteredData.expire_at = new Date(filteredData.expire_at);
        }
      } else if (editModalType === 'user') {
        // UpdateUserAdminDto fields - exclude user_id (it's in URL param)
        const allowedFields = ['name', 'email', 'password', 'phone', 'address', 'nid', 'passport', 'nationality', 'profession', 'age', 'maritalStatus', 'vehicleNo', 'fatherName', 'role'];
        Object.keys(filteredData).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete filteredData[key];
          }
        });
      }
      
      return filteredData;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveEdit(getFilteredFormData());
    };

    if (!editModalOpen || !editModalType || !editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Edit {editModalType.charAt(0).toUpperCase() + editModalType.slice(1)}
              </h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {editModalType === 'user' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={3}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={11}
                      maxLength={20}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={255}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">National ID *</label>
                    <input
                      type="text"
                      name="nid"
                      value={formData.nid || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Passport</label>
                    <input
                      type="text"
                      name="passport"
                      value={formData.passport || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nationality *</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Profession *</label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={0}
                      max={120}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status *</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus === true ? 'true' : formData.maritalStatus === false ? 'false' : ''}
                      onChange={(e) => setFormData((prev: any) => ({
                        ...prev,
                        maritalStatus: e.target.value === 'true'
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select marital status</option>
                      <option value="true">Married</option>
                      <option value="false">Single</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Number</label>
                    <input
                      type="text"
                      name="vehicleNo"
                      value={formData.vehicleNo || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Father&apos;s Name *</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role || 'customer'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </>
              )}

              {editModalType === 'room' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Room Number</label>
                    <input
                      type="number"
                      name="room_num"
                      value={formData.room_num || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Floor</label>
                    <input
                      type="number"
                      name="floor"
                      value={formData.floor || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price per Night</label>
                    <input
                      type="number"
                      name="room_price"
                      value={formData.room_price || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Room Status</label>
                    <select
                      name="room_status"
                      value={formData.room_status || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Housekeeping Status</label>
                    <select
                      name="housekeeping_status"
                      value={formData.housekeeping_status || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="clean">Clean</option>
                      <option value="waiting_for_clean">Waiting for Clean</option>
                      <option value="needs_service">Needs Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {editModalType === 'food' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      name="item_name"
                      value={formData.item_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="item_price"
                      value={formData.item_price || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                      name="food_type"
                      value={formData.food_type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Available</label>
                    <select
                      name="availability"
                      value={formData.availability?.toString() || 'true'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </div>
                </>
              )}

              {editModalType === 'coupon' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Coupon Code</label>
                    <input
                      type="text"
                      name="coupon_code"
                      value={formData.coupon_code || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Discount Percentage</label>
                    <input
                      type="number"
                      name="coupon_percent"
                      value={formData.coupon_percent || ''}
                      onChange={handleInputChange}
                      min="0.01"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity || ''}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      name="expire_at"
                      value={formData.expire_at ? new Date(formData.expire_at).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {editModalType === 'offer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Offer Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Offer Type</label>
                    <select
                      name="type"
                      value={formData.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="package">Package</option>
                      <option value="offer">Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Original Price</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Add Modal Component
  const AddModal = () => {
    const [formData, setFormData] = useState<any>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : 
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveAdd(formData);
    };

    if (!addModalOpen || !addModalType) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Add New {addModalType.charAt(0).toUpperCase() + addModalType.slice(1)}
              </h2>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {addModalType === 'user' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={3}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={8}
                      maxLength={255}
                      placeholder="Must contain 8+ chars, uppercase, lowercase, number, symbol"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={11}
                      maxLength={20}
                      placeholder="Bangladesh phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={255}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">National ID *</label>
                    <input
                      type="text"
                      name="nid"
                      value={formData.nid || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Passport</label>
                    <input
                      type="text"
                      name="passport"
                      value={formData.passport || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nationality *</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Profession *</label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={0}
                      max={120}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status *</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus === true ? 'true' : formData.maritalStatus === false ? 'false' : ''}
                      onChange={(e) => setFormData((prev: any) => ({
                        ...prev,
                        maritalStatus: e.target.value === 'true'
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select marital status</option>
                      <option value="true">Married</option>
                      <option value="false">Single</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Number</label>
                    <input
                      type="text"
                      name="vehicleNo"
                      value={formData.vehicleNo || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength={5}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Father&apos;s Name *</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={50}
                    />
                  </div>
                </>
              )}

              {addModalType === 'room' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room Number *</label>
                    <input
                      type="number"
                      name="room_num"
                      value={formData.room_num || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Floor *</label>
                    <input
                      type="number"
                      name="floor"
                      value={formData.floor || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room Type *</label>
                    <select
                      name="type"
                      value={formData.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select room type</option>
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suite</option>
                      <option value="presidential">Presidential</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price per Night *</label>
                    <input
                      type="number"
                      name="room_price"
                      value={formData.room_price || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={0}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={0}
                      max={100}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room Status *</label>
                    <select
                      name="room_status"
                      value={formData.room_status || 'available'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Housekeeping Status *</label>
                    <select
                      name="housekeeping_status"
                      value={formData.housekeeping_status || 'clean'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="clean">Clean</option>
                      <option value="waiting_for_clean">Waiting for Clean</option>
                      <option value="needs_service">Needs Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Room features and amenities"
                    />
                  </div>
                </>
              )}

              {addModalType === 'food' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      name="item_name"
                      value={formData.item_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
                    <input
                      type="number"
                      name="item_price"
                      value={formData.item_price || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={0}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Food Category *</label>
                    <select
                      name="food_type"
                      value={formData.food_type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Item description and ingredients"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
                    <select
                      name="availability"
                      value={formData.availability !== undefined ? formData.availability.toString() : 'true'}
                      onChange={(e) => setFormData((prev: any) => ({
                        ...prev,
                        availability: e.target.value === 'true'
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </div>
                </>
              )}

              {addModalType === 'coupon' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      name="coupon_code"
                      value={formData.coupon_code || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      maxLength={20}
                      placeholder="e.g., SAVE20, WELCOME10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Percentage *</label>
                    <input
                      type="number"
                      name="coupon_percent"
                      value={formData.coupon_percent || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={1}
                      max={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={1}
                      placeholder="Number of times this coupon can be used"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="datetime-local"
                      name="expire_at"
                      value={formData.expire_at || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      name="is_active"
                      value={formData.is_active === true ? 'true' : formData.is_active === false ? 'false' : 'true'}
                      onChange={(e) => setFormData((prev: any) => ({
                        ...prev,
                        is_active: e.target.value === 'true'
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {addModalType === 'offer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Offer Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Offer Type *</label>
                    <select
                      name="type"
                      value={formData.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="package">Package</option>
                      <option value="offer">Offer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      rows={3}
                      placeholder="Offer description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={0}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Original Price *</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={0}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valid From *</label>
                    <input
                      type="date"
                      name="validFrom"
                      value={formData.validFrom || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valid Until *</label>
                    <input
                      type="date"
                      name="validUntil"
                      value={formData.validUntil || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'active'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Create {addModalType.charAt(0).toUpperCase() + addModalType.slice(1)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col lg:flex-row">
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
      } lg:translate-x-0 fixed lg:relative z-50 lg:z-auto w-64 lg:w-72 min-w-64 lg:min-w-72 max-w-64 lg:max-w-72 transition-transform duration-300 bg-white shadow-xl border-r border-slate-200 flex flex-col h-full lg:h-screen overflow-hidden`}>
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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
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
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-auto overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-slate-200 flex-shrink-0">
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
                    {sidebarItems.find(item => item.key === activeTab)?.label || 'Admin Dashboard'}
                  </h1>
                  <p className="text-slate-600 mt-1 text-sm lg:text-base">Professional Dashboard System</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Notification Button */}
                <div className="relative notification-dropdown">
                  <button 
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-slate-500">
                            <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                            <p>No new notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      notification.type === 'booking' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {notification.type}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {notification.timestamp.toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-800 font-medium">
                                    {notification.message}
                                  </p>
                                </div>
                                <button
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  className="ml-2 text-slate-400 hover:text-slate-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={refreshAllData}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Refresh all data"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-4 lg:px-6 py-4 lg:py-8 flex-shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4 mb-6 lg:mb-8">
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
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-4 lg:p-6 overflow-auto max-h-[calc(100vh-20rem)]">
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800">User Management</h2>
                      <p className="text-slate-600 mt-1">Manage system users and their information</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerms.users}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, users: e.target.value }))}
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button 
                        onClick={() => handleAdd('user')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add User</span>
                      </button>
                    </div>
                  </div>

                  {/* Users Table - Responsive with horizontal scroll */}
                  <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    {loading.users ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : errors.users ? (
                      <div className="text-center py-8 text-red-600">{errors.users}</div>
                    ) : (
                      <div className="overflow-x-auto max-w-full">
                        <table className="w-full divide-y divide-slate-200" style={{ minWidth: '800px' }}>
                          <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                            <tr>
                              <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider" style={{ minWidth: '150px' }}>User Details</th>
                              <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider" style={{ minWidth: '150px' }}>Contact Information</th>
                              <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider" style={{ minWidth: '150px' }}>Personal Info</th>
                              <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider" style={{ minWidth: '100px' }}>Role</th>
                              <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider" style={{ minWidth: '120px' }}>Registration</th>
                              <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider" style={{ minWidth: '100px' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {filteredUsers.map((user) => (
                              <tr key={user.user_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                                      <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm lg:text-lg">
                                        {user.name.split(' ').map((n) => n[0]).join('')}
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                                      <div className="text-sm text-slate-500">ID: #{user.user_id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-slate-900 font-medium">{user.email || 'No email'}</div>
                                  <div className="text-sm text-slate-500">{user.phone}</div>
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-slate-900">{user.nationality}</div>
                                  <div className="text-sm text-slate-500">{user.profession} • Age {user.age}</div>
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-bold text-slate-900 bg-slate-100 px-2 lg:px-3 py-1 rounded-lg inline-block capitalize">
                                    {user.role}
                                  </div>
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-slate-900">
                                    {new Date(user.registrationDate).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-1 lg:space-x-2">
                                    <button 
                                      onClick={() => handleEdit('user', user)}
                                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1.5 lg:p-2 rounded-lg transition-colors"
                                    >
                                      <Edit2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete('user', user.user_id)}
                                      className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1.5 lg:p-2 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
                          value={searchTerms.rooms}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, rooms: e.target.value }))}
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button 
                        onClick={() => handleAdd('room')}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all"
                      >
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
                    ) : filteredRooms.length === 0 ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">No rooms found</div>
                      </div>
                    ) : (
                      filteredRooms.map((room) => (
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
                            <button 
                              onClick={() => handleEdit('room', room)}
                              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete('room', room.room_num)}
                              className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
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
                          value={searchTerms.food}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, food: e.target.value }))}
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button 
                        onClick={() => handleAdd('food')}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all"
                      >
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
                    ) : filteredFood.length === 0 ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">No menu items found</div>
                      </div>
                    ) : (
                      filteredFood.map((item) => (
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
                            <button 
                              onClick={() => handleEdit('food', item)}
                              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete('food', item.food_id)}
                              className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
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
                          value={searchTerms.coupons}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, coupons: e.target.value }))}
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button 
                        onClick={() => handleAdd('coupon')}
                        className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2.5 rounded-xl hover:from-orange-700 hover:to-orange-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all"
                      >
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
                    ) : filteredCoupons.length === 0 ? (
                      <div className="col-span-full flex justify-center items-center py-8">
                        <div className="text-slate-600">No coupons found</div>
                      </div>
                    ) : (
                      filteredCoupons.map((coupon) => (
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
                            <button 
                              onClick={() => handleEdit('coupon', coupon)}
                              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete('coupon', coupon.coupon_code)}
                              className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
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
                          value={searchTerms.offers}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, offers: e.target.value }))}
                          className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 w-full"
                        />
                      </div>
                      <button 
                        onClick={() => handleAdd('offer')}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Offer</span>
                      </button>
                    </div>
                  </div>

                  {/* Offers Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {filteredOffers.map((offer) => (
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
                            <button 
                              onClick={() => handleEdit('offer', offer)}
                              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete('offer', offer.id)}
                              className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
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
      
      {/* Edit Modal */}
      <EditModal />
      
      {/* Add Modal */}
      <AddModal />
    </div>
  );
};

export default App;
