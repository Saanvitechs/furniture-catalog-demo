import { useState, useEffect } from 'react'
import { 
  Heart, 
  Trash2, 
  ArrowLeft, 
  Home, 
  ShoppingBag,
  DollarSign,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  X,
  AlertCircle,
  ShoppingCart,
  Check
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dummyItems, dummyWishlist, delay } from '../services/dummyData'

// Image utility function
function getImageSrc(item) {
  if (!item) return null
  
  // Check all possible image properties
  const possible = item.image || item.photo || item.photos || item.imageUrl
  if (!possible) return null

  const value = Array.isArray(possible) ? possible[0] : possible
  if (!value) return null

  // Check if it's already a data URL
  if (typeof value === 'string' && value.startsWith('data:')) return value
  
  // Check if it's a regular URL
  if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
    return value
  }
  
  // Check if it's a relative path
  if (typeof value === 'string' && value.startsWith('/')) return value
  
  // Otherwise, assume it's base64
  if (typeof value === 'string') {
    return `data:image/jpeg;base64,${value}`
  }
  
  return null
}

export default function WishlistPage() {
  const navigate = useNavigate()
  
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingItems, setRemovingItems] = useState({})
  const [addingToCartItems, setAddingToCartItems] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch wishlist items
  useEffect(() => {
    fetchWishlistItems()
  }, [])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  async function fetchWishlistItems() {
    try {
      setLoading(true)
      setError(null)
      await delay(300)
      
      const allItems = Object.values(dummyItems).flat()
      const wishlistItemsData = allItems.filter(item => dummyWishlist.has(item.id))
      
      const formattedData = wishlistItemsData.map(item => ({
        ...item,
        id: item.id,
        title: item.name || 'Untitled Item',
        price: item.price || 0
      }))
      
      setWishlistItems(formattedData)
    } catch (err) {
      console.error('Error fetching wishlist:', err)
      setError('Failed to load wishlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Remove item from wishlist
  async function removeFromWishlist(itemId, itemTitle) {
    try {
      setRemovingItems(prev => ({ ...prev, [itemId]: true }))
      
      await delay(200)
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId))
      
      setSuccessMessage(`"${itemTitle}" removed from wishlist`)
      
      console.log(`Item ${itemId} removed from wishlist`)
      
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      setError(`Failed to remove "${itemTitle}" from wishlist. Please try again.`)
      
    } finally {
      setRemovingItems(prev => ({ ...prev, [itemId]: false }))
    }
  }

  // Add item to cart from wishlist
  async function addToCart(item) {
    try {
      setAddingToCartItems(prev => ({ ...prev, [item.id]: true }))
      setError(null)

      // Prepare cart item data
      const cartItemData = {
        itemId: item.id,
        title: item.title,
        price: item.price,
        quantity: 1,
        categoryName: item.categoryName,
        subCategoryName: item.subCategoryName
      }

      await delay(200)
      
      // Show success message
      setSuccessMessage(`"${item.title}" added to cart successfully!`)
      
      return cartItemData
      
    } catch (err) {
      console.error('Error adding to cart:', err)
      setError(`Failed to add "${item.title}" to cart. Please try again.`)
      throw err
    } finally {
      setAddingToCartItems(prev => ({ ...prev, [item.id]: false }))
    }
  }

  // Move item to cart and remove from wishlist
  async function moveToCart(item) {
    try {
      setAddingToCartItems(prev => ({ ...prev, [item.id]: true }))
      
      // First add to cart
      await addToCart(item)
      
      // Then remove from wishlist
      await removeFromWishlist(item.id, item.title)
      
      setSuccessMessage(`"${item.title}" moved to cart`)
      
    } catch (err) {
      console.error('Error moving to cart:', err)
      // Error handling is already done in individual functions
    } finally {
      setAddingToCartItems(prev => ({ ...prev, [item.id]: false }))
    }
  }

  // Add all items to cart
  async function addAllToCart() {
    if (wishlistItems.length === 0) return
    
    const confirmAddAll = window.confirm(`Add all ${wishlistItems.length} items to cart?`)
    if (!confirmAddAll) return
    
    try {
      setLoading(true)
      setError(null)
      
      await delay(300)
      
      setSuccessMessage(`All ${wishlistItems.length} items added to cart`)
      
    } catch (err) {
      console.error('Error adding all to cart:', err)
      setError('Failed to add some items to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Clear all wishlist items
  async function clearWishlist() {
    if (wishlistItems.length === 0) return
    
    const confirmClear = window.confirm(`Are you sure you want to remove all ${wishlistItems.length} items from your wishlist?`)
    if (!confirmClear) return
    
    try {
      setLoading(true)
      setError(null)
      
      await delay(300)
      
      setWishlistItems([])
      setSuccessMessage('All items removed from wishlist')
      
    } catch (err) {
      console.error('Error clearing wishlist:', err)
      setError('Failed to clear wishlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Navigate to cart page
  function goToCart() {
    navigate('/cart')
  }

  // Navigate to item details or category
  function navigateToItem(item) {
    if (item.categoryName) {
      navigate('/categories', {
        state: { 
          selectedCategory: item.categoryName,
          selectedItemId: item.id
        }
      })
    }
  }

  // Handle back navigation
  function handleBack() {
    navigate(-1)
  }

  // Handle home navigation
  function handleHome() {
    navigate('/')
  }

  // Format price with commas
  function formatPrice(price) {
    if (!price) return '₹0'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Calculate total value
  function calculateTotalValue() {
    return wishlistItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
  }

  // Get unique categories count
  function getUniqueCategoriesCount() {
    const categories = wishlistItems
      .map(item => item.categoryName)
      .filter(Boolean)
    return new Set(categories).size
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">Save your favorite items for later</p>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-full p-3 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-full p-4 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                <div className="mt-2">
                  <button
                    onClick={fetchWishlistItems}
                    className="text-sm text-red-800 hover:text-red-900 font-medium"
                  >
                    Try again →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlistItems.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Wishlist is Empty</h3>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your wishlist yet. Browse our categories and add items you love!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/categories')}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Browse Categories
                </button>
                <button
                  onClick={handleHome}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Items Grid */}
        {!loading && !error && wishlistItems.length > 0 && (
          <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in">
              <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(calculateTotalValue())}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                    <ShoppingBag className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {getUniqueCategoriesCount()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                    <ShoppingCart className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cart Ready</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {wishlistItems.length} items
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
              {wishlistItems.map((item) => {
                const imageSrc = getImageSrc(item)
                
                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden relative animate-fade-in-up"
                  >
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                      <button
                        onClick={() => removeFromWishlist(item.id, item.title)}
                        disabled={removingItems[item.id]}
                        className="p-2 bg-white/90 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow hover:shadow-md"
                        title="Remove from wishlist"
                      >
                        {removingItems[item.id] ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => moveToCart(item)}
                        disabled={addingToCartItems[item.id]}
                        className="p-2 bg-white/90 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 transition-colors shadow hover:shadow-md"
                        title="Add to cart"
                      >
                        {addingToCartItems[item.id] ? (
                          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Item Image */}
                    <div 
                      onClick={() => navigateToItem(item)}
                      className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer group-hover:opacity-90 transition-opacity"
                    >
                      {imageSrc ? (
                        <img 
                          src={imageSrc} 
                          alt={item.title || item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Image failed to load
                            e.target.onerror = null
                            e.target.style.display = 'none'
                            // Show fallback
                            const container = e.target.parentElement
                            container.innerHTML = `
                              <div class="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-gray-200">
                                <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span class="text-gray-500 text-sm">Image not available</span>
                              </div>
                            `
                          }}
                        />
                      ) : (
                        // Fallback when no image
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-gray-500 text-sm">No image available</span>
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
                          {formatPrice(item.price || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-4">
                      <h3 
                        onClick={() => navigateToItem(item)}
                        className="text-lg font-semibold text-gray-900 mb-3 hover:text-red-600 transition-colors cursor-pointer line-clamp-2"
                        title={item.title || 'Untitled Item'}
                      >
                        {item.title || 'Untitled Item'}
                      </h3>
                      
                      {/* Category & Subcategory */}
                      <div className="space-y-2 mb-4">
                        {item.categoryName && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate" title={item.categoryName}>
                              {item.categoryName}
                            </span>
                          </div>
                        )}
                        
                        {item.subCategoryName && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate" title={item.subCategoryName}>
                              {item.subCategoryName}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Description if available */}
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2" title={item.description}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bulk Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing {wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'} • Total: {formatPrice(calculateTotalValue())}
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={addAllToCart}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add All to Cart ({wishlistItems.length})
                  </button>
                  
                  <button
                    onClick={goToCart}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Go to Cart
                  </button>
                  
                  <button
                    onClick={clearWishlist}
                    disabled={loading || wishlistItems.length === 0}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Items
                  </button>
                  
                  <button
                    onClick={() => navigate('/categories')}
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm flex items-center"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse More Items
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-500">
              💖 Save items you love for later purchase
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleHome}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </button>
              
              <button
                onClick={goToCart}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </button>
              
              <button
                onClick={() => navigate('/categories')}
                className="flex items-center text-sm text-red-600 hover:text-red-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add some custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </main>
  )
}