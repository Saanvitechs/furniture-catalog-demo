import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Package,
  CreditCard,
  Truck,
  Shield,
  X,
  Home,
  ShoppingBag,
  Loader,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react'
import { dummyCartItems, dummyAddresses, delay } from '../services/dummyData'



export default function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [cartSummary, setCartSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [error, setError] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)

  // Fetch cart data and addresses
  useEffect(() => {
    fetchCartData()
    fetchAddresses()
  }, [])

  async function fetchCartData() {
    try {
      setLoading(true)
      await delay(300)
      
      setCartItems(dummyCartItems || [])
      setCartSummary({
        totalItems: dummyCartItems.length,
        totalPrice: dummyCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      })
    } catch (err) {
      console.error('Error fetching cart data:', err)
      setError('Failed to load cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchAddresses() {
    try {
      setAddressLoading(true)
      await delay(200)
      
      setAddresses(dummyAddresses || [])
      
      // Select the first address by default if available
      if (dummyAddresses && dummyAddresses.length > 0) {
        setSelectedAddress(dummyAddresses[0].id)
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
    } finally {
      setAddressLoading(false)
    }
  }

  // Update item quantity
  async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }

    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }))
      await delay(200)
      await fetchCartData()
    } catch (err) {
      console.error('Error updating quantity:', err)
      setError('Failed to update quantity. Please try again.')
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }))
    }
  }

  // Remove item from cart
  async function removeFromCart(itemId) {
    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }))
      await delay(200)
      await fetchCartData()
    } catch (err) {
      console.error('Error removing item:', err)
      setError('Failed to remove item. Please try again.')
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }))
    }
  }

  // Clear entire cart
  async function clearCart() {
    if (!window.confirm('Are you sure you want to clear your cart?')) return
    
    try {
      setLoading(true)
      await delay(200)
      setCartItems([])
      setCartSummary(null)
    } catch (err) {
      console.error('Error clearing cart:', err)
      setError('Failed to clear cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Create order from cart
  async function createOrder() {
    if (cartItems.length === 0) {
      setError('Your cart is empty. Add items before checking out.')
      return
    }

    if (!selectedAddress) {
      setError('Please select a delivery address.')
      return
    }

    try {
      setCheckoutLoading(true)
      setError(null)
      
      await delay(500)
      
      const orderId = 'ORD-' + Math.floor(Math.random() * 100000).toString().padStart(6, '0')
      
      if (orderId) {
        await delay(200)
        
        alert(`Order #${orderId} created successfully!`)
        setCartItems([])
        setCartSummary(null)
        navigate('/orders')
      }
    } catch (err) {
      console.error('Error creating order:', err)
      setError('Failed to create order. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Calculate item total
  function calculateItemTotal(item) {
    const price = parseFloat(item.price || 0)
    const quantity = item.quantity || 1
    return (price * quantity).toFixed(2)
  }

  // Get image source for item
  function getItemImage(item) {
    if (item.photos && item.photos.length > 0) {
      return item.photos[0]
    } else if (item.photo) {
      return item.photo
    } else if (item.image) {
      return item.image
    }
    return null
  }

  // Format price for display
  function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
  }

  // Format address for display
  function formatAddress(address) {
    return `${address.fullName}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`
  }

  // Get selected address object
  const selectedAddressObj = addresses.find(addr => addr.id === selectedAddress)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-6">
         
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                Your Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            
            {cartItems.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  View Orders
                </button>
                <button
                  onClick={clearCart}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-400 mr-3">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-red-800">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to add items!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Browse Categories
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                View Orders
              </button>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Selection */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                  </h2>
                </div>
                <div className="p-4">
                  {addressLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-gray-600">Loading addresses...</span>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-3">No addresses found</p>
                      <button
                        onClick={() => navigate('/profile?tab=addresses')}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors text-sm font-medium"
                      >
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {selectedAddressObj ? selectedAddressObj.fullName : 'Select an address'}
                          </p>
                          {selectedAddressObj && (
                            <p className="text-sm text-gray-600 mt-1">
                              {formatAddress(selectedAddressObj)}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            Phone: {selectedAddressObj?.phone}
                          </p>
                        </div>
                        {selectedAddressObj && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Selected
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Change Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const imageSrc = getItemImage(item)
                    const itemTotal = calculateItemTotal(item)
                    const isUpdating = updating[item.itemId]
                    
                    return (
                      <div key={item.itemId} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Product Image */}
                          <div className="sm:w-32 sm:h-32 w-full h-48 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={item.title || item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {item.title || item.itemName}
                                </h3>
                                {item.categoryName && (
                                  <p className="text-sm text-gray-500 mb-2">
                                    Category: {item.categoryName}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  Rs. {formatPrice(itemTotal)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Rs. {formatPrice(item.price)} each
                                </p>
                              </div>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex items-center border border-gray-300 rounded-full">
                                  <button
                                    onClick={() => updateQuantity(item.itemId, (item.quantity || 1) - 1)}
                                    disabled={isUpdating || (item.quantity || 1) <= 1}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-3 py-2 text-gray-900 font-medium">
                                    {isUpdating ? '...' : (item.quantity || 1)}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.itemId, (item.quantity || 1) + 1)}
                                    disabled={isUpdating}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                {isUpdating && (
                                  <div className="ml-3">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(item.itemId)}
                                disabled={isUpdating}
                                className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full disabled:opacity-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow p-4 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. 12,000</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Rs. 500</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">Rs. 500</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>Rs. 13,000</span>
                    </div>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button
                  onClick={createOrder}
                  disabled={checkoutLoading || cartItems.length === 0 || !selectedAddress}
                  className={`w-full mt-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center ${
                    checkoutLoading || !selectedAddress
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {checkoutLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : !selectedAddress ? (
                    'Select Address First'
                  ) : (
                    'Place Order'
                  )}
                </button>
                
                {/* View Orders Button */}
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full mt-3 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  View My Orders
                </button>
                
                {/* Trust Signals */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Free shipping on orders over Rs. 1000</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Multiple payment options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Additional Features Section */}
        {cartItems.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Enjoy free standard shipping on orders over Rs. 1000. Delivery in 3-5 business days.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">30-Day Returns</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Not satisfied? Return any item within 30 days for a full refund.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Your payment information is encrypted and secure with 256-bit SSL.
              </p>
            </div>
          </div>
        )}

        {/* Address Selection Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Delivery Address</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                {addressLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <button
                      onClick={() => {
                        setShowAddressModal(false)
                        navigate('/profile?tab=addresses')
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAddress === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedAddress(address.id)
                          setShowAddressModal(false)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">{address.fullName}</p>
                              {selectedAddress === address.id && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <Check className="w-3 h-3 mr-1" />
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{address.street}</p>
                            <p className="text-sm text-gray-600 mb-1">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                          </div>
                          {selectedAddress === address.id && (
                            <div className="ml-4">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setShowAddressModal(false)
                        navigate('/profile?tab=addresses')
                      }}
                      className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add New Address</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}