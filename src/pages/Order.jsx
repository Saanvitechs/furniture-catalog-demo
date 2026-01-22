import React, { useState, useEffect } from 'react';
import { dummyOrders, delay } from '../services/dummyData';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingOrderId, setCancellingOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            await delay(300);
            setOrders(dummyOrders);
            setError('');
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        setCancellingOrderId(orderId);
        try {
            await delay(300);
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'Cancelled' } : order
                )
            );
            alert('Order cancelled successfully!');
        } catch (err) {
            alert('Failed to cancel order. Please try again.');
            console.error('Error cancelling order:', err);
        } finally {
            setCancellingOrderId(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case 'READY FOR DELIVERY':
            case 'CREATED':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getImageSrc = (item) => {
        const possible = item.image || item.photo || item.photos || item.imageUrl;
        if (!possible) return null;
        
        const value = Array.isArray(possible) ? possible[0] : possible;
        if (!value) return null;
        
        if (typeof value === 'string' && value.startsWith('data:')) return value;
        
        if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
            return value;
        }
        
        if (typeof value === 'string' && value.startsWith('/')) return value;
        
        if (typeof value === 'string') {
            return `data:image/jpeg;base64,${value}`;
        }
        
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B77466] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600 mt-2">View and manage your orders</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                        <button 
                            onClick={fetchOrders}
                            className="ml-4 text-sm font-medium text-red-800 hover:text-red-900 underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div 
                                key={order.id} 
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    {/* Order Header with Status and Date */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-200">
                                        <div>
                                            <div className="flex items-center space-x-4">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    Order #{order.id}
                                                </h2>
                                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            
                                            {/* Order Placed Section */}
                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center text-gray-700">
                                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <span className="font-medium">Order Placed: </span>
                                                        <span>{formatDateTime(order.date)}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Total Amount */}
                                                <div className="flex items-center text-gray-700">
                                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div>
                                                        <span className="font-medium">Total Amount: </span>
                                                        <span className="text-lg font-bold text-[#B77466]">
                                                           ₹ 35,500
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Estimated/Delivered Date */}
                                                {order.estimatedDelivery && (
                                                    <div className="flex items-center text-gray-700">
                                                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <span className="font-medium">
                                                                {order.status === 'Delivered' ? 'Delivered On: ' : 'Estimated Delivery: '}
                                                            </span>
                                                            <span>{formatDate(order.deliveredDate || order.estimatedDelivery)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Cancel Order Button */}
                                        {(order.status === 'Ready for Delivery' || order.status === 'Processing' || order.status === 'Shipped') && (
                                            <button
                                                onClick={() => cancelOrder(order.id)}
                                                disabled={cancellingOrderId === order.id}
                                                className={`mt-4 sm:mt-0 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                    cancellingOrderId === order.id
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-red-600 text-white hover:bg-red-700'
                                                }`}
                                            >
                                                {cancellingOrderId === order.id ? (
                                                    <span className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Cancelling...
                                                    </span>
                                                ) : (
                                                    'Cancel Order'
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Address and Order Details in Two Columns */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                        {/* Shipping Address Section */}
                                        <div className="lg:col-span-1">
                                            <div className="bg-gray-50 rounded-lg p-5 h-full">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Shipping Address
                                                </h3>
                                                {order.shippingAddress ? (
                                                    <div className="space-y-3">
                                                        <div className="text-gray-700">
                                                            <div className="font-medium mb-1">Delivery Address:</div>
                                                         
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500 italic">
                                                         Flat 4B, Emerald Heights, Park Road, Andheri East

Mumbai, Maharashtra
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Details Section */}
                                        <div className="lg:col-span-2">
                                            <div className="bg-gray-50 rounded-lg p-5 h-full">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Order Details
                                                </h3>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-700">Payment Method:</span>
                                                        <span className="font-medium">{order.paymentMethod || 'Credit Card'}</span>
                                                    </div>
                                                    
                                                    {order.trackingNumber && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-700">Tracking Number:</span>
                                                            <span className="font-medium text-[#B77466]">{order.trackingNumber}</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-700">Order Status:</span>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({order.items.length})</h4>
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => {
                                                const imageSrc = getImageSrc(item);
                                                
                                                return (
                                                    <div 
                                                        key={item.id || index} 
                                                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                                                    >
                                                        <div className="w-24 h-24 flex-shrink-0 mr-4">
                                                            {imageSrc ? (
                                                                <img 
                                                                    src={imageSrc} 
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e2e8f0"/%3E%3Ctext x="50" y="50" font-size="10" text-anchor="middle" dy=".3em" fill="%2394a3b8"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-gray-900 text-lg">{item.name}</h5>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Unit Price: {formatPrice(item.price)}
                                                            </p>
                                                            <div className="flex items-center mt-2">
                                                                <span className="text-gray-700">Quantity:</span>
                                                                <span className="ml-2 font-medium">{item.quantity}</span>
                                                            </div>
                                                            {item.description && (
                                                                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            <div className="text-xl font-bold text-gray-900">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                Total
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <div className="text-gray-700">
                                                    <div className="text-lg font-medium">Order Summary</div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-[#B77466]">
                                                      ₹ 35,500
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        Includes all taxes and shipping
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Refresh Button */}
                {orders.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={fetchOrders}
                            className="px-6 py-3 bg-[#B77466] text-white font-medium rounded-lg hover:bg-[#A3665A] transition-colors duration-200 flex items-center justify-center mx-auto"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Orders
                        </button>
                    </div>
                )}

                {/* Information Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-blue-800">Order Information & Support</h3>
                            <div className="mt-3 text-sm text-blue-700 space-y-2">
                                <div className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <p>Orders can be cancelled when status is "Ready for Delivery", "Processing", or "Shipped"</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <p>Once cancelled, orders cannot be restored</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <p>Delivered orders cannot be cancelled</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <p>For any issues with your order, contact customer support at support@example.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;