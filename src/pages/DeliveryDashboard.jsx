import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Shield,
  RefreshCw,
  AlertCircle,
  LogOut,
  ToggleLeft,
  ToggleRight,
  Menu,
  X,
  Home,
  Calendar,
  DollarSign
} from 'lucide-react';
import { dummyOrders, delay } from '../services/dummyData';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpSending, setOtpSending] = useState({});
  const [otpVerifying, setOtpVerifying] = useState({});
  const [otpInput, setOtpInput] = useState('');
  const [stats, setStats] = useState({
    totalDelivered: 0,
    pendingDeliveries: 0,
    todaysDeliveries: 0,
    totalEarnings: 0
  });
  const [deliveryStatus, setDeliveryStatus] = useState('ACTIVE');
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'

  // Fetch assigned orders for delivery person
  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      await delay(300);
      
      setAssignedOrders(dummyOrders);

      const deliveredOrders = dummyOrders.filter(order => order.status === 'Ready for Delivery');
      const pendingOrders = dummyOrders.filter(order => order.status !== 'Ready for Delivery');

      setStats({
        totalDelivered: deliveredOrders.length,
        pendingDeliveries: pendingOrders.length,
        todaysDeliveries: dummyOrders.length,
        totalEarnings: 5000
      });

      setError('');
    } catch (err) {
      console.error('Error fetching assigned orders:', err);
      setError('Failed to load assigned orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Request OTP for delivery
  const requestOTP = async (orderId) => {
    try {
      setOtpSending(prev => ({ ...prev, [orderId]: true }));
      await delay(300);
      alert('OTP has been sent to the customer. Please ask the customer for the OTP.');
    } catch (err) {
      console.error('Error requesting OTP:', err);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setOtpSending(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Verify OTP and confirm delivery
  const confirmDelivery = async (orderId, otp) => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setOtpVerifying(prev => ({ ...prev, [orderId]: true }));
      await delay(300);

      setAssignedOrders(prevOrders =>
        prevOrders.map(order =>
          getOrderId(order) === orderId ? response.data : order
        )
      );

      setSelectedOrder(null);
      setOtpInput('');
      alert('Delivery confirmed successfully!');
      fetchAssignedOrders();
    } catch (err) {
      console.error('Error confirming delivery:', err);
      if (err.response?.status === 400) {
        alert('Invalid OTP. Please check and try again.');
      } else {
        alert('Failed to confirm delivery. Please try again.');
      }
    } finally {
      setOtpVerifying(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Toggle delivery status
  const toggleDeliveryStatus = async () => {
    try {
      setTogglingStatus(true);
      await delay(300);
      const newStatus = response.data.status || (deliveryStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
      setDeliveryStatus(newStatus);
      alert(`Delivery status changed to ${newStatus}`);
    } catch (err) {
      console.error('Error toggling delivery status:', err);
      alert('Failed to update delivery status. Please try again.');
    } finally {
      setTogglingStatus(false);
    }
  };

  // Logout delivery person
  const handleLogout = () => {
    localStorage.removeItem('deliveryToken');
    navigate('/delivery/login');
  };

  useEffect(() => {
    fetchAssignedOrders();
    const interval = setInterval(fetchAssignedOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'OUT_FOR_DELIVERY':
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'PENDING':
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'OUT_FOR_DELIVERY':
      case 'ASSIGNED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
      case 'FAILED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Get order ID from order object
  const getOrderId = (order) => {
    return order.orderId || order.id || order.orderNumber || 'N/A';
  };

  // Check if order is deliverable (should show OTP button)
  const isOrderDeliverable = (order) => {
    const status = order.status?.toUpperCase();
    return !(
      status === 'DELIVERED' ||
      status === 'COMPLETED' ||
      status === 'CANCELLED' ||
      status === 'FAILED'
    );
  };

  // Get order status text
  const getOrderStatusText = (status) => {
    if (!status || status === 'UNKNOWN') return 'READY FOR DELIVERY';
    return status.replace(/_/g, ' ');
  };

  // Filter orders based on active tab
  const filteredOrders = assignedOrders.filter(order => {
    const status = order.status?.toUpperCase();
    if (activeTab === 'pending') {
      return !(status === 'DELIVERED' || status === 'COMPLETED' || status === 'CANCELLED');
    } else {
      return status === 'DELIVERED' || status === 'COMPLETED' || status === 'CANCELLED';
    }
  });

  // Handle OTP request button click
  const handleOtpRequestClick = (order) => {
    const orderId = getOrderId(order);
    if (!isOrderDeliverable(order)) {
      alert('This order has already been delivered or cancelled.');
      return;
    }

    if (selectedOrder && getOrderId(selectedOrder) === orderId) {
      setSelectedOrder(null);
      setOtpInput('');
    } else {
      setSelectedOrder(order);
      requestOTP(orderId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">


              {/* Delivery Status Indicator */}
              <div className="hidden md:flex items-center ml-8 px-4 py-2 rounded-lg bg-gray-100">
                <div className={`w-2 h-2 rounded-full mr-2 ${deliveryStatus === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-700">
                  Status: <span className={deliveryStatus === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
                    {deliveryStatus}
                  </span>
                </span>
                <div className="flex items-center gap-4">
                  {/* Status Text */}
                  <span
                    className={`text-sm font-semibold transition-colors
      ${deliveryStatus === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'}
    `}
                  >
                    {deliveryStatus === 'ACTIVE' ? 'Online' : 'Offline'}
                  </span>

                  {/* Toggle Button */}
                  <button
                    onClick={toggleDeliveryStatus}
                    disabled={togglingStatus}
                    className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300
      ${deliveryStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}
      ${togglingStatus ? 'opacity-50 cursor-not-allowed' : ''}
    `}
                    aria-label="Toggle delivery status"
                  >
                    {/* Knob */}
                    <span
                      className={`inline-block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300
        ${deliveryStatus === 'ACTIVE' ? 'translate-x-7' : 'translate-x-1'}
      `}
                    />

                    {/* Loading Spinner */}
                    {togglingStatus && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </span>
                    )}
                  </button>
                </div>


              </div>
            </div>


          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${deliveryStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-700">
                  Status: <span className={deliveryStatus === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
                    {deliveryStatus}
                  </span>
                </span>
              </div>
              <button
                onClick={toggleDeliveryStatus}
                disabled={togglingStatus}
                className="text-sm font-medium text-blue-600 disabled:opacity-50"
              >
                {togglingStatus ? 'Switching...' : 'Switch'}
              </button>
            </div>
            <button
              onClick={fetchAssignedOrders}
              disabled={loading}
              className="flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Orders
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center py-2 text-red-600 border border-red-200 rounded-lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg mr-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDelivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg mr-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todaysDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'pending'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Pending Deliveries ({stats.pendingDeliveries})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'completed'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Completed ({stats.totalDelivered})
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-400 animate-spin mx-auto" />
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-4 text-gray-600">
                  {activeTab === 'pending'
                    ? 'No pending deliveries'
                    : 'No completed deliveries'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderId = getOrderId(order);
                  const deliverable = isOrderDeliverable(order);
                  const isSelected = selectedOrder && getOrderId(selectedOrder) === orderId;

                  return (
                    <div key={orderId} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        {/* Order Info */}
                        <div className="flex-1">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Order #{orderId}</h3>
                              <div className="flex items-center mt-1">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1.5">{getOrderStatusText(order.status)}</span>
                                </span>
                                {order.deliveryFee && (
                                  <span className="ml-3 text-sm text-gray-600">
                                    Fee: ₹{order.deliveryFee.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Details</h4>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 text-gray-400 mr-2" />
                                  <span>{order.customerName || order.customer?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                  <span>{order.customerPhone || order.customer?.phone || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h4>
                              <div className="flex">
                                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">
                                  {order.deliveryAddress || order.address || 'Address not specified'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Items */}
                          {order.items && order.items.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                              <div className="flex flex-wrap gap-2">
                                {order.items.slice(0, 4).map((item, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                                  >
                                    {item.title || item.name} × {item.quantity || 1}
                                  </span>
                                ))}
                                {order.items.length > 4 && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                    +{order.items.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="lg:w-80">
                          {deliverable ? (
                            <>
                              <button
                                onClick={() => handleOtpRequestClick(order)}
                                disabled={otpSending[orderId]}
                                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center mb-3 ${otpSending[orderId]
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-blue-700 text-white'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                              >
                                {otpSending[orderId] ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Sending OTP...
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-4 h-4 mr-2" />
                                    {isSelected ? 'OTP Requested' : 'Request OTP'}
                                  </>
                                )}
                              </button>

                              {isSelected && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-sm text-blue-800 mb-3">
                                    Enter the 6-digit OTP received by the customer:
                                  </p>
                                  <input
                                    type="text"
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    maxLength={6}
                                    className="w-full px-4 py-3 border border-blue-300 rounded-lg text-center text-lg tracking-widest mb-3"
                                  />
                                  <button
                                    onClick={() => confirmDelivery(orderId, otpInput)}
                                    disabled={otpVerifying[orderId] || otpInput.length !== 6}
                                    className={`w-full py-3 px-4 rounded-lg font-medium ${otpVerifying[orderId] || otpInput.length !== 6
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                      }`}
                                  >
                                    {otpVerifying[orderId] ? (
                                      <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                                        Verifying...
                                      </>
                                    ) : (
                                      'Confirm Delivery'
                                    )}
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className={`w-full py-3 px-4 rounded-lg font-medium text-center ${order.status === 'DELIVERED' || order.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                              {order.status === 'DELIVERED' || order.status === 'COMPLETED'
                                ? '✓ Delivered'
                                : '✗ Cancelled'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;