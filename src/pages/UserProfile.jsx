import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Home,
  Phone,
  Navigation,
  Save,
  AlertCircle,
  ChevronRight,
  Package,
  Shield
} from 'lucide-react';
import { dummyAddresses, delay } from '../services/dummyData';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Fetch user profile and addresses
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      await delay(300);
      
      const userEmail = sessionStorage.getItem('email') || 'user@example.com';
      
      setUserProfile({
        email: userEmail,
        phone: '+91 9876543210',
        name: 'Rajesh Kumar',
        addresses: dummyAddresses
      });
      
      setAddresses(dummyAddresses);
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input change for new address
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for editing address
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newAddress.fullName.trim() || !newAddress.phone.trim() || 
        !newAddress.street.trim() || !newAddress.city.trim() || 
        !newAddress.state.trim() || !newAddress.pincode.trim()) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await delay(300);
      dummyAddresses.push({ ...newAddress, id: Date.now() });
      
      // Add the new address to the list
      setAddresses(prev => [...prev, response.data]);
      
      // Reset form and show success
      setNewAddress({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
      });
      setShowAddForm(false);
      setSuccess('Address added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error adding address:', err);
      setError('Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update existing address
const handleUpdateAddress = async () => {
  if (!editingAddress) return;

  try {
    setLoading(true);
    setError('');

    await delay(300);

    // Update local state safely
    setAddresses(prev =>
      prev.map(addr =>
        addr.id === editingAddress.id
          ? {
              ...addr,
              fullName: editingAddress.fullName,
              phone: editingAddress.phone,
              street: editingAddress.street,
              city: editingAddress.city,
              state: editingAddress.state,
              pincode: editingAddress.pincode,
            }
          : addr
      )
    );

    setEditingAddress(null);
    setSuccess('Address updated successfully!');

    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    console.error('Error updating address:', err);
    setError('Failed to update address. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await delay(300);
      const index = dummyAddresses.findIndex(a => a.id === addressId);
      if (index !== -1) {
        dummyAddresses.splice(index, 1);
      }
      
      // Remove the address from the list
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      setSuccess('Address deleted successfully!');
      
      // If we were editing this address, clear editing state
      if (editingAddress && editingAddress.id === addressId) {
        setEditingAddress(null);
      }
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingAddress(null);
  };

  // Cancel adding new address
  const cancelAddForm = () => {
    setShowAddForm(false);
    setNewAddress({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    });
  };

  if (loading && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D34E4E] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        

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
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-8">
              {/* User Card */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#D34E4E] to-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {userProfile?.name || 'User'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {userProfile?.email || 'user@example.com'}
                </p>
                {userProfile?.phone && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{userProfile.phone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#D34E4E]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="font-bold text-gray-900">
                        {userProfile?.totalOrders || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Orders</p>
                      <p className="font-bold text-gray-900">
                        {userProfile?.activeOrders || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Saved Addresses</p>
                      <p className="font-bold text-gray-900">{addresses.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Your data is securely encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Addresses */}
          <div className="lg:col-span-2">
            {/* Addresses Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#D34E4E]" />
                  Saved Addresses
                </h2>
                <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
              </div>
              
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#D34E4E]  text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-[#D34E4E]/30"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Add New Address</span>
                </button>
              )}
            </div>

            {/* Add New Address Form */}
            {showAddForm && (
              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <Plus className="w-5 h-5 text-[#D34E4E]" />
                    Add New Address
                  </h3>
                  <button
                    onClick={cancelAddForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={newAddress.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent transition-all duration-300"
                        placeholder="Enter 10-digit phone number"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent transition-all duration-300"
                        placeholder="House number, street, area"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent transition-all duration-300"
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent transition-all duration-300"
                        placeholder="Enter state"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent transition-all duration-300"
                        placeholder="Enter 6-digit PIN"
                        pattern="[0-9]{6}"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-[#D34E4E] to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Address
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={cancelAddForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses List */}
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No addresses saved</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Add your delivery addresses to make checkout faster and easier.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D34E4E] to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="p-6">
                      {editingAddress?.id === address.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                              <Edit2 className="w-5 h-5 text-[#D34E4E]" />
                              Edit Address
                            </h4>
                            <div className="flex gap-2">
                              <button
                                onClick={handleUpdateAddress}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                value={editingAddress.fullName}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D34E4E]"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={editingAddress.phone}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D34E4E]"
                                pattern="[0-9]{10}"
                                required
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street
                              </label>
                              <input
                                type="text"
                                name="street"
                                value={editingAddress.street}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D34E4E]"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={editingAddress.city}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D34E4E]"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                              </label>
                              <input
                                type="text"
                                name="state"
                                value={editingAddress.state}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D34E4E]"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                PIN Code
                              </label>
                              <input
                                type="text"
                                name="pincode"
                                value={editingAddress.pincode}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D34E4E]"
                                pattern="[0-9]{6}"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Home className="w-5 h-5 text-[#D34E4E]" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-gray-900">
                                    {address.fullName}
                                  </h4>
                                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Phone className="w-4 h-4" />
                                    <span>{address.phone}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="ml-13">
                                <div className="flex items-start gap-2 text-gray-700 mb-2">
                                  <Navigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium">{address.street}</p>
                                    <p>
                                      {address.city}, {address.state} - {address.pincode}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingAddress(address)}
                                className="p-2 text-[#D34E4E] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit address"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete address"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;