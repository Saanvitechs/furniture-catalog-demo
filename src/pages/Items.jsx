import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyItems, delay } from '../services/dummyData'
import { ChevronLeft, ChevronRight, Filter, Search, ShoppingCart, Heart, Eye } from 'lucide-react'


export default function Items() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [sortField, setSortField] = useState('price')
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  // Cart state (updated to match CategoryHierarchy)
  const [cartItems, setCartItems] = useState([])
  const [cartSummary, setCartSummary] = useState(null)
  const [cartLoading, setCartLoading] = useState({})
  const [showCartNotification, setShowCartNotification] = useState(false)
  const [cartNotificationItem, setCartNotificationItem] = useState(null)
  
  // Wishlist state (matching CategoryHierarchy)
  const [wishlistItems, setWishlistItems] = useState(new Set())
  const [wishlistLoading, setWishlistLoading] = useState({})

  useEffect(() => {
  fetchItems()
}, [page, size, sortField, sortDirection, selectedCategory, searchTerm])

useEffect(() => {
  fetchCartData()
}, [])

  // Fetch cart data
  async function fetchCartData() {
    try {
      await delay(200)
      setCartItems([] || [])
      setCartSummary({ totalItems: 0, totalPrice: 0 })
    } catch (err) {
      console.error('Error fetching cart data:', err)
    }
  }

 async function fetchItems() {
  try {
    setLoading(true)
    setError(null)

    await delay(300)

    const allItems = Object.values(dummyItems).flat()
    let data = allItems

    // 🔍 IF SEARCH TERM EXISTS → FILTER BY NAME
    if (searchTerm.trim()) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setTotalPages(1)
    }

    // Apply sorting
    if (sortField === 'price') {
      data.sort((a, b) => sortDirection === 'asc' ? a.price - b.price : b.price - a.price)
    }

    const processedItems = data.map(item => {
      let imageUrl = null
      if (item.photos && item.photos.length > 0) {
        imageUrl = typeof item.photos[0] === 'string'
          ? item.photos[0]
          : URL.createObjectURL(item.photos[0])
      }

      return {
        ...item,
        imageUrl,
        formattedPrice: `Rs ${new Intl.NumberFormat('en-IN').format(item.price)}`
      }
    })

    setItems(processedItems)
    setTotalElements(processedItems.length)
    
    if (!searchTerm.trim()) {
      setTotalPages(Math.ceil(processedItems.length / size))
    }

  } catch (err) {
    console.error('Error fetching items:', err)
    setError('Failed to fetch items. Please try again.')
    setItems([])
  } finally {
    setLoading(false)
  }
}


  // Function to handle image loading
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image'
  }

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1)
    }
  }

  const handleSortChange = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field with default ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0) // Reset to first page when searching
    fetchItems()
  }

  // Add to wishlist function (matching CategoryHierarchy)
  async function addToWishlist(itemId) {
    if (wishlistLoading[itemId]) return;
    
    try {
      setWishlistLoading(prev => ({ ...prev, [itemId]: true }));
      await delay(200);
      dummyWishlist.add(itemId);
      setWishlistItems(prev => new Set(prev).add(itemId));
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist. Please try again.');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [itemId]: false }));
    }
  }

  // Remove from wishlist function (matching CategoryHierarchy)
  async function removeFromWishlist(itemId) {
    if (wishlistLoading[itemId]) return;
    
    try {
      setWishlistLoading(prev => ({ ...prev, [itemId]: true }));
      await delay(200);
      dummyWishlist.delete(itemId);
      const newWishlist = new Set(wishlistItems);
      newWishlist.delete(itemId);
      setWishlistItems(newWishlist);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist. Please try again.');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [itemId]: false }));
    }
  }

  // Check if user is authenticated
  function isUserAuthenticated() {
    return !!sessionStorage.getItem('email');
  }

  // Toggle wishlist status (matching CategoryHierarchy)
  async function toggleWishlist(itemId) {
    // Check if user is authenticated, if not redirect to login
    if (!isUserAuthenticated()) {
      navigate('/login');
      return;
    }

    if (wishlistItems.has(itemId)) {
      await removeFromWishlist(itemId);
    } else {
      await addToWishlist(itemId);
    }
  }

  // Add to cart function (updated to match CategoryHierarchy)
  async function addToCart(itemId) {
    // Check if user is authenticated, if not redirect to login
    if (!isUserAuthenticated()) {
      navigate('/login');
      return;
    }

    if (cartLoading[itemId]) return;
    
    try {
      setCartLoading(prev => ({ ...prev, [itemId]: true }));
      await delay(200);
      
      // Show notification
      const item = items.find(i => 
        String(i.id || i.itemId || i._id) === String(itemId)
      );
      setCartNotificationItem(item);
      setShowCartNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowCartNotification(false);
        setCartNotificationItem(null);
      }, 3000);
      
      // Refresh cart data
      await fetchCartData();
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setCartLoading(prev => ({ ...prev, [itemId]: false }));
    }
  }

  // Extract unique categories for filter
  const categories = [...new Set(items.map(item => item.categoryName))].filter(Boolean)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">Browse our collection of premium furniture items</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items by name, description..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent focus:outline-none"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
              }}
              className="appearance-none w-full md:w-48 pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-')
                setSortField(field)
                setSortDirection(direction)
              }}
              className="appearance-none w-full md:w-48 pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent focus:outline-none"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Name: A to Z</option>
              <option value="title-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D34E4E]"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchItems}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Items Grid */}
      {!loading && !error && (
        <>
          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {items.length} of {totalElements} items
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Items per page:</span>
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value))
                  setPage(0)
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#D34E4E] focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 group"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🛋️</div>
                        <p className="text-sm text-gray-500">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Actions - Updated with wishlist toggle */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => toggleWishlist(item.id)}
                      disabled={wishlistLoading[item.id]}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
                    >
                      <Heart 
                        className={`w-4 h-4 ${wishlistItems.has(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} 
                      />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                      <Eye className="w-4 h-4 text-gray-600 hover:text-[#D34E4E]" />
                    </button>
                  </div>
                  
                  {/* Category Badge */}
                  {item.categoryName && (
                    <span className="absolute top-3 left-3 bg-[#D34E4E] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.categoryName}
                    </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Subcategory */}
                  {item.subCategoryName && (
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.subCategoryName}
                      </span>
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {item.formattedPrice}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => addToCart(item.id)}
                      disabled={cartLoading[item.id]}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D34E4E] text-white rounded-lg hover:from-[#D34E4E] hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-semibold">{cartLoading[item.id] ? 'Adding...' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Notification */}
          {showCartNotification && cartNotificationItem && (
            <div className="fixed bottom-4 right-4 z-50">
              <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">
                      Added to cart!
                    </p>
                    <p className="text-sm text-green-700">
                      {cartNotificationItem.title || cartNotificationItem.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-700">
                Page <span className="font-semibold">{page + 1}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    page === 0
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i
                    } else if (page < 3) {
                      pageNum = i
                    } else if (page > totalPages - 3) {
                      pageNum = totalPages - 5 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                          page === pageNum
                            ? 'border-[#D34E4E] bg-blue-50 text-[#D34E4E]'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages - 1}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    page >= totalPages - 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'No items available at the moment.'}
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setPage(0)
              }}
              className="px-6 py-2.5 bg-[#D34E4E] text-white rounded-lg hover:bg-[#D34E4E] transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </main>
  )
}