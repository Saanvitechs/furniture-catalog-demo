import { useEffect, useState } from 'react'
import { 
  ChevronRight, 
  Home, 
  ArrowLeft, 
  Folder, 
  FolderOpen, 
  Image as ImageIcon, 
  Search, 
  X, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List, 
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Trash2
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { dummyCategories, dummySubCategories, dummyItems, dummyWishlist, dummyCartItems, delay } from '../services/dummyData'
import SofaConfigurator from '../components/SofaConfigurator'

// Image utility function
// FIXED: Image utility function - properly handles both base64 and regular URLs
function getImageSrc(obj) {
  if (!obj) return null
  const possible = obj.image || obj.imageBase64 || obj.imageData || obj.photo || obj.photos || obj.photosBase64
  if (!possible) return null

  const value = Array.isArray(possible) ? possible[0] : possible
  if (!value) return null

  // Check if it's already a data URL
  if (typeof value === 'string' && value.startsWith('data:')) return value
  
  // Check if it's a regular URL/path (starts with /)
  if (typeof value === 'string' && value.startsWith('/')) return value
  
  // Otherwise, assume it's base64 data
  return `data:image/png;base64,${value}`
}

// Main Component
export default function CategoryHierarchy() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // View states for navigation between categories, subcategories, and items
  const [view, setView] = useState('categories') // 'categories', 'subcategories', 'items'
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCategories, setFilteredCategories] = useState([])
  const [filteredSubCategories, setFilteredSubCategories] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  
  // Sorting and View Options
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [hasMoreSubCategories, setHasMoreSubCategories] = useState(false)
  const [hasItems, setHasItems] = useState(false)

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState(new Set())
  const [wishlistLoading, setWishlistLoading] = useState({})

  // Cart state
  const [cartItems, setCartItems] = useState([])
  const [cartSummary, setCartSummary] = useState(null)
  const [cartLoading, setCartLoading] = useState({})
  const [showCartNotification, setShowCartNotification] = useState(false)
  const [cartNotificationItem, setCartNotificationItem] = useState(null)

  // Sofa Configurator state
  const [showConfigurator, setShowConfigurator] = useState(false)
  const [configuratorProductImage, setConfiguratorProductImage] = useState(null)

  // Check for state passed from Home page
  useEffect(() => {
    if (location.state) {
      const { selectedCategory, subCategories, categoryData } = location.state
      
      if (selectedCategory && subCategories) {
        // If coming from Home with a selected category and its subcategories
        setSelectedCategory(selectedCategory)
        setSubCategories(subCategories)
        setFilteredSubCategories(subCategories)
        setView('subcategories')
        
        // Update breadcrumbs
        const newBreadcrumbs = [
          { name: 'Categories', type: 'root', action: () => setView('categories') },
          { name: selectedCategory, type: 'category', action: () => {} }
        ]
        setBreadcrumbs(newBreadcrumbs)
      } else if (selectedCategory) {
        // If only category name is passed, fetch subcategories
        setSelectedCategory(selectedCategory)
        checkAndNavigateCategory(selectedCategory)
      }
    }
  }, [location.state])

  // Fetch categories on initial load if not coming from Home
  useEffect(() => {
    if (view === 'categories' && !location.state?.selectedCategory) {
      fetchCategories()
    }
  }, [view, location.state])

  // Fetch cart data on initial load
  useEffect(() => {
    fetchCartData()
  }, [])

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories)
      setFilteredSubCategories(subCategories)
      setFilteredItems(items)
    } else {
      const query = searchQuery.toLowerCase()
      
      if (view === 'categories') {
        setFilteredCategories(
          categories.filter(cat => 
            (cat.categoryName || cat.name || '').toLowerCase().includes(query) ||
            (cat.description || '').toLowerCase().includes(query)
          )
        )
      } else if (view === 'subcategories') {
        setFilteredSubCategories(
          subCategories.filter(sub => 
            sub.name.toLowerCase().includes(query) ||
            sub.categoryName.toLowerCase().includes(query) ||
            (sub.parentName || '').toLowerCase().includes(query)
          )
        )
      } else if (view === 'items') {
        setFilteredItems(
          items.filter(item => 
            (item.title || item.name || item.itemName || '').toLowerCase().includes(query) ||
            (item.description || '').toLowerCase().includes(query) ||
            (item.categoryName || item.category || '').toLowerCase().includes(query) ||
            (item.subCategoryName || '').toLowerCase().includes(query)
          )
        )
      }
    }
  }, [searchQuery, categories, subCategories, items, view])

  // Fetch categories
  async function fetchCategories() {
    try {
      setLoading(true)
      setError(null)

      await delay(300)
      const data = dummyCategories.data || []
      setCategories(data)
      setFilteredCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch cart data
  async function fetchCartData() {
    try {
      await delay(200)
      setCartItems(dummyCartItems || [])
      setCartSummary({
        totalItems: dummyCartItems.length,
        totalPrice: dummyCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      })
    } catch (err) {
      console.error('Error fetching cart data:', err)
    }
  }

  // Add item to wishlist
  async function addToWishlist(itemId) {
    if (wishlistLoading[itemId]) return;
    
    try {
      setWishlistLoading(prev => ({ ...prev, [itemId]: true }));
      await delay(200)
      setWishlistItems(prev => new Set(prev).add(itemId));
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist. Please try again.');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [itemId]: false }));
    }
  }

  // Remove item from wishlist
  async function removeFromWishlist(itemId) {
    if (wishlistLoading[itemId]) return;
    
    try {
      setWishlistLoading(prev => ({ ...prev, [itemId]: true }));
      await delay(200)
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

  // Toggle wishlist status
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

  // Add item to cart
  async function addToCart(itemId) {
    // Check if user is authenticated, if not redirect to login
    if (!isUserAuthenticated()) {
      navigate('/login');
      return;
    }

    if (cartLoading[itemId]) return;
    
    try {
      setCartLoading(prev => ({ ...prev, [itemId]: true }));
      await delay(200)
      
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

  // Check if category has subcategories or directly show items
  async function checkAndNavigateCategory(categoryName) {
    try {
      setLoading(true)
      setError(null)
      setHasMoreSubCategories(false)
      setHasItems(false)

      await delay(300)
      
      const subCategoriesData = dummySubCategories[categoryName] || []
      let itemsData = dummyItems[categoryName] || []

      setSubCategories(subCategoriesData)
      setFilteredSubCategories(subCategoriesData)
      setItems(itemsData)
      setFilteredItems(itemsData)
      setHasMoreSubCategories(subCategoriesData.length > 0)
      setHasItems(itemsData.length > 0)

      setView('subcategories')
      updateBreadcrumbs(categoryName, null)
    } catch (err) {
      console.error('Error checking category:', err)
      setError('Failed to load category data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data for a specific subcategory (both child subcategories and items)
  async function fetchSubCategoryData(subCategoryName) {
    try {
      setLoading(true)
      setError(null)
      setHasMoreSubCategories(false)
      setHasItems(false)

      await delay(300)
      
      const subCategoriesData = []
      const allItems = Object.values(dummyItems).flat()
      let itemsData = allItems.filter(item => item.categoryName === selectedCategory)

      setSubCategories(subCategoriesData)
      setFilteredSubCategories(subCategoriesData)
      setItems(itemsData)
      setFilteredItems(itemsData)
      setHasMoreSubCategories(subCategoriesData.length > 0)
      setHasItems(itemsData.length > 0)

      updateBreadcrumbs(selectedCategory, subCategoryName)
    } catch (err) {
      console.error('Error fetching subcategory data:', err)
      setError('Failed to load subcategory data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Update breadcrumbs properly
  function updateBreadcrumbs(categoryName, parentSubCategoryName = null) {
    const newBreadcrumbs = [
      { 
        name: 'Categories', 
        type: 'root', 
        action: () => {
          setView('categories')
          setSelectedCategory(null)
          setSelectedSubCategory(null)
          setSearchQuery('')
          setHasMoreSubCategories(false)
          setHasItems(false)
        }
      }
    ]
    
    if (categoryName) {
      newBreadcrumbs.push({ 
        name: categoryName, 
        type: 'category',
        action: () => {
          setSelectedSubCategory(null)
          setSearchQuery('')
          checkAndNavigateCategory(categoryName)
        }
      })
    }
    
    if (parentSubCategoryName) {
      newBreadcrumbs.push({ 
        name: parentSubCategoryName, 
        type: 'subcategory',
        action: () => {
          setSelectedSubCategory(parentSubCategoryName)
          setSearchQuery('')
          fetchSubCategoryData(parentSubCategoryName)
        }
      })
    }
    
    setBreadcrumbs(newBreadcrumbs)
  }

  // Handle category selection from categories list
  function handleCategorySelect(category) {
    const categoryName = category.categoryName || category.name
    setSelectedCategory(categoryName)
    setSelectedSubCategory(null)
    setSearchQuery('')
    checkAndNavigateCategory(categoryName)
  }

  // Handle subcategory selection
  async function handleSubCategorySelect(subCategory) {
    const subCategoryName = subCategory.name
    setSelectedSubCategory(subCategoryName)
    setSearchQuery('')
    
    // Fetch both child subcategories and items for this subcategory
    fetchSubCategoryData(subCategoryName)
  }

  // Fetch items only (for pure items view)
  async function fetchItemsOnly(categoryName, subCategoryName = null) {
    try {
      setLoading(true)
      setError(null)

      await delay(300)
      
      let data = dummyItems[categoryName] || []

      let filteredData = data
      if (subCategoryName) {
        filteredData = data.filter(
          item => item.subCategoryName === subCategoryName
        )
      }

      setItems(filteredData)
      setFilteredItems(filteredData)
      setTotalItems(filteredData.length)

      setView('items')
      setHasMoreSubCategories(false)
      setHasItems(true)
    } catch (err) {
      console.error('Error fetching items:', err)
      setError('Failed to load items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Navigate back
  function handleBack() {
    if (view === 'items') {
      if (selectedSubCategory) {
        setView('subcategories')
        fetchSubCategoryData(selectedSubCategory)
      } else if (selectedCategory) {
        setView('subcategories')
        checkAndNavigateCategory(selectedCategory)
      }
      setSearchQuery('')
    } else if (view === 'subcategories') {
      if (selectedSubCategory) {
        // Go back to parent or category
        const hasParent = breadcrumbs.length > 2
        if (hasParent) {
          const parentCrumb = breadcrumbs[breadcrumbs.length - 2]
          if (parentCrumb && parentCrumb.action) {
            parentCrumb.action()
          }
        } else {
          setView('categories')
          setSelectedCategory(null)
          setSelectedSubCategory(null)
          setHasMoreSubCategories(false)
          setHasItems(false)
        }
      } else {
        setView('categories')
        setSelectedCategory(null)
        setHasMoreSubCategories(false)
        setHasItems(false)
      }
      setSearchQuery('')
    }
  }

  // Clear search
  function clearSearch() {
    setSearchQuery('')
  }

  // Toggle sort order (for items view)
  function toggleSortOrder() {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newSortOrder)
    
    // Refresh items if in items-only view
    if (view === 'items' && selectedCategory) {
      fetchItemsOnly(selectedCategory, selectedSubCategory)
    }
  }

  // Toggle view mode
  function toggleViewMode() {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
  }

  // Show only items view
  function showItemsOnly() {
    if (selectedSubCategory) {
      fetchItemsOnly(selectedCategory, selectedSubCategory)
    } else if (selectedCategory) {
      fetchItemsOnly(selectedCategory)
    }
  }

  // Navigate to cart page
  function goToCart() {
    navigate('/cart')
  }

  // FIXED: Open sofa configurator - IMPORTANT CHANGE HERE
  function openConfigurator(item) {
    // The SofaConfigurator component already has its own base image paths:
    // - baseSofaImage: '/sofabase/sofa_base.png' 
    // - colorLayerImage: '/sofabase/normalized_sofa_1.png'
    // - legsImage: `/sofalegs/legs_variant_${selectedLeg}.png`
    
    // We don't need to pass a product image to the configurator because 
    // it uses its own fixed base images. The configurator is a standalone 
    // tool, not dependent on the product image from the item.
    
    // However, if you want to pass a custom base image, you can use:
    // let productImage = null
    // ... (your image extraction logic here)
    
    // For now, set to null to use the default sofa base image
    setConfiguratorProductImage(null) // Using default sofa base image
    setShowConfigurator(true)
    
    // Alternatively, if you want to use a specific base image path:
    // setConfiguratorProductImage('/sofabase/sofa_base.png')
  }

  // Get current data based on view
  const getCurrentData = () => {
    switch(view) {
      case 'categories': return filteredCategories
      case 'subcategories': return filteredSubCategories
      case 'items': return filteredItems
      default: return []
    }
  }

  const currentData = getCurrentData()

  // Wishlist Icon Component
  function WishlistIcon({ itemId, className = "" }) {
    const isInWishlist = wishlistItems.has(String(itemId));
    const isLoading = wishlistLoading[String(itemId)];
    
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleWishlist(String(itemId));
        }}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all duration-200 z-10 ${
          isInWishlist 
            ? `bg-[#FFE1AF] text-[#B77466] hover:opacity-80` 
            : `bg-white/90 text-gray-500 hover:bg-white hover:text-[#B77466]`
        } shadow-md hover:shadow-lg ${className}`}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
        )}
      </button>
    );
  }

  // Add to Cart Button Component
  function AddToCartButton({ itemId, className = "" }) {
    const isLoading = cartLoading[String(itemId)];
    
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          addToCart(String(itemId));
        }}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#B77466] text-white rounded-full hover:bg-[#A3665A] transition-colors text-sm ${className} ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        title="Add to cart"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    )
  }

  // Cart Stats Component
  function CartStats() {
    const cartCount = cartItems.length || 0;
    const cartTotal = cartSummary?.totalPrice || 0;
    
    return (
      <button
        onClick={goToCart}
        className="flex items-center px-4 py-2 bg-opacity-10 rounded-full transition-colors group"
        style={{
          backgroundColor: `rgba(183, 116, 102, 0.1)`,
          color: '#B77466'
        }}
        title="View cart"
      >
        <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        <div className="text-left">
          <div className="font-semibold">{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
          <div className="text-xs opacity-75">${cartTotal.toFixed(2)}</div>
        </div>
      </button>
    )
  }

  // Render categories view
  function renderCategories() {
    return (
      <>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Categories</h1>
          <p className="text-gray-600 mt-2">Select a category to browse subcategories or items</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#D34E4E] focus:border-[#D34E4E] text-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentData.map((category) => {
            const imageSrc = getImageSrc(category)
            const categoryName = category.categoryName || category.name || 'Unnamed'
            
            return (
              <div
                key={category.id || category.name}
                onClick={() => handleCategorySelect(category)}
                className="group bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={categoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <Folder className="w-8 h-8 text-[#D34E4E]" />
                      </div>
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D34E4E] transition-colors truncate">
                      {categoryName}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#D34E4E] group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{category.description}</p>
                  )}
                  
                  <div className="mt-4 flex items-center text-sm text-[#D34E4E] font-medium">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    <span>View Details</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  // Render subcategories view (with optional items)
  function renderSubCategories() {
    return (
      <>
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedSubCategory ? `${selectedSubCategory}` : `${selectedCategory}`}
              </h1>
              <p className="text-gray-600 mt-2">
                {selectedSubCategory 
                  ? `Browse items and subcategories under ${selectedSubCategory}` 
                  : `Browse items and subcategories in ${selectedCategory}`
                }
              </p>
            </div>
            
            {/* Show Items Only Button */}
            {hasItems && (
              <button
                onClick={showItemsOnly}
                className="flex items-center px-4 py-2 bg-[#D34E4E] text-white rounded-full hover:bg-[#D34E4E] transition-colors text-sm"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                View All Items
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search in ${selectedSubCategory || selectedCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#D34E4E] focus:border-[#D34E4E] text-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Subcategories Section */}
        {hasMoreSubCategories && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Subcategories</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-4 py-3 rounded-full">
                {filteredSubCategories.length} items
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubCategories.map((subCategory) => {
                const imageSrc = getImageSrc(subCategory)
                const isParent = subCategory.parentName === null
                
                return (
                  <div
                    key={subCategory.id}
                    onClick={() => handleSubCategorySelect(subCategory)}
                    className="group bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={subCategory.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                          <div className={`w-16 h-16 ${isParent ? 'bg-blue-100' : 'bg-purple-100'} rounded-full flex items-center justify-center mb-3`}>
                            {isParent ? (
                              <FolderOpen className="w-8 h-8 text-[#D34E4E]" />
                            ) : (
                              <Folder className="w-8 h-8 text-purple-500" />
                            )}
                          </div>
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D34E4E] transition-colors truncate">
                          {subCategory.name}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#D34E4E] transition-colors" />
                      </div>
                      
                      {/* Info */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Category: {subCategory.categoryName}</span>
                        </div>
                        
                        {subCategory.parentName && (
                          <div className="flex items-center">
                            <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Parent: {subCategory.parentName}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          isParent ? 'text-[#D34E4E]' : 'text-purple-600'
                        }`}>
                          {isParent ? 'View Details' : 'View Items'}
                        </span>
                        <span className="text-xs text-gray-400">Click to explore</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Items Section */}
        {hasItems && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedSubCategory ? `Items in ${selectedSubCategory}` : `Items in ${selectedCategory}`}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-4 py-3 rounded-full">
                {filteredItems.length} items
              </span>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id || item.title} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <ItemListItem key={item.id || item.title} item={item} />
                ))}
              </div>
            )}
            
            {/* View All Items Button */}
            <div className="mt-8 text-center">
              <button
                onClick={showItemsOnly}
                className="inline-flex items-center px-6 py-3 bg-[#D34E4E] text-white rounded-full hover:bg-[#D34E4E] transition-colors text-sm font-medium"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                View All Items with Sorting
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Render items-only view
  function renderItems() {
    return (
      <>
        {/* Header with Sorting Options */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Items {selectedSubCategory ? `in "${selectedSubCategory}"` : `in "${selectedCategory}"`}
              </h1>
              <p className="text-gray-600 mt-2">
                {selectedSubCategory 
                  ? `All furniture items under ${selectedSubCategory}`
                  : `All items in ${selectedCategory} category`
                }
              </p>
            </div>
            
            {/* Sorting and View Controls */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                  title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
                >
                  {viewMode === 'grid' ? (
                    <List className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Grid className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
              
              {/* Sort Order Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
                  title={`Sort by Price ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="w-5 h-5 text-gray-700" />
                  ) : (
                    <SortDesc className="w-5 h-5 text-gray-700" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Price {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#D34E4E] focus:border-[#D34E4E] text-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Items Display based on View Mode */}
        {currentData.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentData.map((item, index) => (
                <ItemCard key={item.id || item.title || index} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentData.map((item, index) => (
                <ItemListItem key={item.id || item.title || index} item={item} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </>
    )
  }

  // Item Card Component for Grid View
  function ItemCard({ item }) {
    // Extract item ID from multiple possible fields
    const itemId = item.id || item.itemId || item._id || item.title || item.name || item.itemName
    const uniqueId = String(itemId) || `item-${Date.now()}-${Math.random()}`
    
    const itemName = item.title || item.name || item.itemName || 'Unnamed Item'
    const price = item.price ? parseFloat(item.price) : null
    
    // Handle images - can be array or single string
    let imageSrc = null
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      imageSrc = item.photos[0] // Use first photo
    } else if (item.photo) {
      imageSrc = item.photo
    } else if (item.image) {
      imageSrc = item.image
    } else if (item.imageBase64) {
      imageSrc = item.imageBase64
    } else if (item.photosBase64 && Array.isArray(item.photosBase64) && item.photosBase64.length > 0) {
      imageSrc = item.photosBase64[0]
    }
    
    // Ensure it's a valid data URL
    if (imageSrc && !imageSrc.startsWith('data:')) {
      imageSrc = `data:image/jpeg;base64,${imageSrc}`
    }

    return (
      <div className="group bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        {/* Wishlist Icon - Always show */}
        <div className="absolute top-4 right-4 z-20">
          <WishlistIcon itemId={uniqueId} />
        </div>
        
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={itemName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <ImageIcon className="w-8 h-8 text-green-500" />
              </div>
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={itemName}>
            {itemName}
          </h3>
          
          {/* Item Details */}
          <div className="space-y-2 text-sm text-gray-600">
            {price !== null && (
              <div className="flex items-center justify-between">
                <span>Price:</span>
                <span className="font-semibold text-green-600">Rs {price.toFixed(2)}</span>
              </div>
            )}
            
            {item.description && (
              <p className="text-gray-500 text-sm line-clamp-2" title={item.description}>
                {item.description}
              </p>
            )}
            
            {item.categoryName && (
              <div className="flex items-center text-sm text-gray-500">
                <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{item.categoryName}</span>
              </div>
            )}
            
            {item.subCategoryName && (
              <div className="flex items-center text-sm text-gray-500">
                <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{item.subCategoryName}</span>
              </div>
            )}
          </div>
          
          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => openConfigurator(item)}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              View Details
            </button>
            <AddToCartButton itemId={uniqueId} />
          </div>
        </div>
      </div>
    )
  }

  // Item List Component for List View
  function ItemListItem({ item }) {
    // Extract item ID from multiple possible fields
    const itemId = item.id || item.itemId || item._id || item.title || item.name || item.itemName
    const uniqueId = String(itemId) || `item-${Date.now()}-${Math.random()}`
    
    const itemName = item.title || item.name || item.itemName || 'Unnamed Item'
    const price = item.price ? parseFloat(item.price) : null
    
    // Handle images - can be array or single string
    let imageSrc = null
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      imageSrc = item.photos[0] // Use first photo
    } else if (item.photo) {
      imageSrc = item.photo
    } else if (item.image) {
      imageSrc = item.image
    } else if (item.imageBase64) {
      imageSrc = item.imageBase64
    } else if (item.photosBase64 && Array.isArray(item.photosBase64) && item.photosBase64.length > 0) {
      imageSrc = item.photosBase64[0]
    }
    
    // Ensure it's a valid data URL
    if (imageSrc && !imageSrc.startsWith('data:')) {
      imageSrc = `data:image/jpeg;base64,${imageSrc}`
    }

    return (
      <div className="bg-white rounded-xl shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
        {/* Wishlist Icon - Always show */}
        <div className="absolute top-4 right-4 z-20">
          <WishlistIcon itemId={uniqueId} />
        </div>
        
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-48 sm:h-48 w-full h-48 sm:h-auto overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={itemName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{itemName}</h3>
                
                {item.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {item.categoryName && (
                    <div className="flex items-center">
                      <Folder className="w-4 h-4 mr-2" />
                      <span>{item.categoryName}</span>
                    </div>
                  )}
                  
                  {item.subCategoryName && (
                    <div className="flex items-center">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      <span>{item.subCategoryName}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Price and Action */}
              <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-end gap-2">
                {price !== null && (
                  <div className="text-2xl font-bold text-green-600">
                    ${price.toFixed(2)}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openConfigurator(item)}
                    className="px-4 py-2 bg-[#D34E4E] text-white rounded-full hover:bg-[#D34E4E] transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  <AddToCartButton itemId={uniqueId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          {view !== 'categories' && (
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 group transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="mb-6">
            <nav
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}

                  <button
                    onClick={crumb.action}
                    disabled={!crumb.action || index === breadcrumbs.length - 1}
                    className={`ml-2 truncate max-w-[200px] transition-colors disabled:opacity-50 disabled:cursor-default ${
                      index === breadcrumbs.length - 1
                        ? 'text-[#D34E4E] font-semibold cursor-default'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {crumb.type === 'root' ? (
                      <Home className="w-4 h-4" />
                    ) : (
                      crumb.name
                    )}
                  </button>
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D34E4E]"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setError(null)
                      if (view === 'categories') fetchCategories()
                      else if (view === 'subcategories' && selectedSubCategory) fetchSubCategoryData(selectedSubCategory)
                      else if (view === 'subcategories' && selectedCategory) checkAndNavigateCategory(selectedCategory)
                      else if (view === 'items') showItemsOnly()
                    }}
                    className="text-sm text-red-800 hover:text-red-900 font-medium"
                  >
                    Try again →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty States */}
        {!loading && !error && currentData.length === 0 && view !== 'subcategories' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              {view === 'categories' && <Folder className="w-12 h-12 text-gray-400" />}
              {view === 'items' && <ImageIcon className="w-12 h-12 text-gray-400" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No Results Found' : 
                view === 'categories' ? 'No Categories Found' :
                'No Items Found'
              }
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery ? 
                `No results found for "${searchQuery}". Try different keywords.` :
                view === 'categories' ? 'There are no categories available. Add some categories to get started.' :
                selectedSubCategory ?
                  `There are no items available in ${selectedSubCategory}.` :
                  `There are no items available in ${selectedCategory}.`
              }
            </p>
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="px-6 py-2 bg-[#D34E4E] text-white rounded-full hover:bg-[#D34E4E] transition-colors text-sm font-medium"
              >
                Clear Search
              </button>
            ) : view === 'categories' ? (
              <button
                onClick={fetchCategories}
                className="px-6 py-2 bg-[#D34E4E] text-white rounded-full hover:bg-[#D34E4E] transition-colors text-sm font-medium"
              >
                Refresh
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-[#D34E4E] text-white rounded-full hover:bg-[#D34E4E] transition-colors text-sm font-medium"
              >
                Go Back
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {view === 'categories' && renderCategories()}
            {view === 'subcategories' && renderSubCategories()}
            {view === 'items' && renderItems()}
          </>
        )}

        {/* Stats Footer */}
        {!loading && !error && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-500">
                {view === 'categories' && `Showing ${currentData.length} categories`}
                {view === 'subcategories' && (
                  <>
                    {hasMoreSubCategories && `${filteredSubCategories.length} subcategories`}
                    {hasMoreSubCategories && hasItems && ' • '}
                    {hasItems && `${filteredItems.length} items`}
                    {!hasMoreSubCategories && !hasItems && 'No content available'}
                  </>
                )}
                {view === 'items' && `Showing ${currentData.length} items (Sorted by Price: ${sortOrder === 'asc' ? 'Low to High' : 'High to Low'})`}
                {searchQuery && ` for "${searchQuery}"`}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Wishlist Stats */}
                {wishlistItems.size > 0 && (
                  <div className="flex items-center text-sm text-red-600">
                    <Heart className="w-4 h-4 mr-1 fill-current" />
                    <span>{wishlistItems.size} in wishlist</span>
                  </div>
                )}
                
                {/* Cart Stats */}
                <CartStats />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Notification */}
      {showCartNotification && cartNotificationItem && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 animate-slideUp">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            <div>
              <p className="font-semibold">Added to cart!</p>
              <p className="text-sm opacity-90">
                {cartNotificationItem.title || cartNotificationItem.name}
              </p>
            </div>
            <button
              onClick={() => setShowCartNotification(false)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sofa Configurator Modal */}
      {showConfigurator && (
        <SofaConfigurator 
          // FIXED: Pass null to use the default sofa base image from the SofaConfigurator component
          productImage={configuratorProductImage} // This will be null, so SofaConfigurator uses its default
          onClose={() => setShowConfigurator(false)}
        />
      )}
    </main>
  )
}