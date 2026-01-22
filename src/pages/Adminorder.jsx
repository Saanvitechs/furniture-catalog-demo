import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  Users,
  Filter,
  Search,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Shield,
  Eye,
  UserPlus,
  ChevronDown,
  MoreVertical,
  Calendar,
  DollarSign,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { dummyOrders, delay } from '../services/dummyData';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('PAID');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  // Form states
  const [newDeliveryMan, setNewDeliveryMan] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('SHIPPED');
  const [deliveryManId, setDeliveryManId] = useState('');
  
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  // Status options
  const statusOptions = [
    { value: 'CREATED', label: 'Created', color: 'bg-blue-100 text-blue-800' },
    { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'SHIPPED', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch orders by status
  const fetchOrders = async (status = 'PAID') => {
    try {
      setLoading(true);
      setError('');
      
      await delay(300);
      setOrders(dummyOrders || []);
      setFilteredOrders(dummyOrders || []);
      
      // Calculate stats
      calculateOrderStats(dummyOrders || []);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch delivery personnel
  const fetchDeliveryMen = async () => {
    try {
      await delay(200);
      setDeliveryMen([
        { id: 1, name: 'Raj Kumar', phone: '+91 9876543210', email: 'raj@example.com' },
        { id: 2, name: 'Priya Singh', phone: '+91 9876543211', email: 'priya@example.com' }
      ] || []);
    } catch (err) {
      console.error('Error fetching delivery personnel:', err);
      setDeliveryMen([]);
    }
  };

  // Calculate order statistics
  const calculateOrderStats = (ordersList) => {
    const stats = {
      total: ordersList.length,
      paid: ordersList.filter(o => o.status === 'PAID').length,
      shipped: ordersList.filter(o => o.status === 'SHIPPED').length,
      delivered: ordersList.filter(o => o.status === 'DELIVERED').length,
      cancelled: ordersList.filter(o => o.status === 'CANCELLED').length
    };
    setOrderStats(stats);
  };

  useEffect(() => {
    fetchOrders(statusFilter);
    fetchDeliveryMen();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchOrders(statusFilter);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [statusFilter]);

  // Filter orders based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = orders.filter(order => 
      order.orderId.toString().includes(query) ||
      (order.customerName && order.customerName.toLowerCase().includes(query)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(query))
    );
    
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  // Register new delivery man
  const handleRegisterDeliveryMan = async (e) => {
    e.preventDefault();
    
    if (!newDeliveryMan.name.trim() || !newDeliveryMan.phone.trim() || 
        !newDeliveryMan.email.trim() || !newDeliveryMan.password.trim()) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await delay(300);
      
      // Reset form and close modal
      setNewDeliveryMan({
        name: '',
        phone: '',
        email: '',
        password: ''
      });
      setShowRegisterModal(false);
      setSuccess('Delivery personnel registered successfully!');
      
      // Refresh delivery men list
      fetchDeliveryMen();
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error registering delivery man:', err);
      if (err.response?.status === 400) {
        setError('Invalid data. Please check the form fields.');
      } else if (err.response?.status === 409) {
        setError('Delivery personnel with this email or phone already exists.');
      } else {
        setError('Failed to register delivery personnel. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      setError('');
      
      await delay(300);
      
      setSuccess(`Order #${selectedOrder.orderId} status updated to ${selectedStatus}`);
      setShowStatusModal(false);
      
      // Refresh orders
      fetchOrders(statusFilter);
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Assign order to delivery man
  const handleAssignOrder = async () => {
    if (!selectedOrder || !deliveryManId) return;

    try {
      setLoading(true);
      setError('');
      
      await delay(300);
      
      setSuccess(`Order #${selectedOrder.orderId} assigned to delivery personnel`);
      setShowAssignModal(false);
      setDeliveryManId('');
      
      // Refresh orders
      fetchOrders(statusFilter);
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error assigning order:', err);
      setError('Failed to assign order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format price
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusOption.color}`}>
        {statusOption.label}
      </span>
    );
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setSearchQuery('');
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
           
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchOrders(statusFilter);
                  fetchDeliveryMen();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              <button
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" />
                Add Delivery
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.paid}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.shipped}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.cancelled}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusFilterChange(status.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        statusFilter === status.value
                          ? status.color
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order ID or customer..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-600">
                        {searchQuery ? 'Try a different search term' : `No ${statusFilter.toLowerCase()} orders available`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                Order #{order.orderId}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          {order.deliveryAddress && (
                            <div className="mt-2 flex items-start gap-1 text-xs text-gray-600">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{order.deliveryAddress}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customerEmail || 'N/A'}
                          </div>
                          {order.customerPhone && (
                            <div className="text-xs text-gray-500">
                              {order.customerPhone}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                        {order.deliveryManName && (
                          <div className="mt-1 text-xs text-gray-600">
                            Assigned to: {order.deliveryManName}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.orderDate)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => {
                              // Navigate to order details or show modal
                              setSelectedOrder(order);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Update Status Button */}
                          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setSelectedStatus(order.status === 'PAID' ? 'SHIPPED' : 'DELIVERED');
                                setShowStatusModal(true);
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Update status"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Assign to Delivery Button */}
                          {order.status === 'PAID' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowAssignModal(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Assign to delivery"
                            >
                              <Truck className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Personnel Section */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                Delivery Personnel ({deliveryMen.length})
              </h3>
              <p className="text-gray-600 mt-1">Manage delivery team assignments</p>
            </div>
            <button
              onClick={fetchDeliveryMen}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          
          {deliveryMen.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No delivery personnel found</h4>
              <p className="text-gray-600 mb-4">Register delivery personnel to start assigning orders</p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" />
                Add First Delivery Personnel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryMen.map((deliveryMan) => (
                <div key={deliveryMan.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{deliveryMan.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {deliveryMan.status && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                deliveryMan.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-800' 
                                  : deliveryMan.status === 'INACTIVE'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {deliveryMan.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{deliveryMan.phone}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{deliveryMan.email}</span>
                        </div>
                        
                        {deliveryMan.activeOrders !== undefined && (
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-600">Active Orders:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              deliveryMan.activeOrders > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {deliveryMan.activeOrders || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Register Delivery Man Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-green-600" />
                  Register Delivery Personnel
                </h3>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleRegisterDeliveryMan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newDeliveryMan.name}
                    onChange={(e) => setNewDeliveryMan(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newDeliveryMan.phone}
                    onChange={(e) => setNewDeliveryMan(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit phone number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newDeliveryMan.email}
                    onChange={(e) => setNewDeliveryMan(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="delivery@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newDeliveryMan.password}
                    onChange={(e) => setNewDeliveryMan(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Update Order Status
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Update status for <span className="font-bold">Order #{selectedOrder.orderId}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Current status: {getStatusBadge(selectedOrder.status)}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status *
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions
                      .filter(opt => opt.value !== selectedOrder.status)
                      .map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Status'}
                  </button>
                  
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Order Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Assign to Delivery
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Assign <span className="font-bold">Order #{selectedOrder.orderId}</span> to delivery personnel
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Order amount: {formatPrice(selectedOrder.totalAmount)}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Delivery Personnel *
                  </label>
                  <select
                    value={deliveryManId}
                    onChange={(e) => setDeliveryManId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose delivery person</option>
                    {deliveryMen.map((man) => (
                      <option key={man.id} value={man.id}>
                        {man.name} ({man.phone}) - {man.activeOrders || 0} active orders
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAssignOrder}
                    disabled={loading || !deliveryManId}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Assigning...' : 'Assign Order'}
                  </button>
                  
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;