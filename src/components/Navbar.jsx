import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  Home, 
  Grid, 
  Heart, 
  ShoppingCart, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Package,
  Layers,
  Sofa,
  ShoppingBag,
  Truck,
  Users,
  ListOrdered,
  Search,
  Award,
  Star,
  Palette
} from 'lucide-react'

function NavItem({ to, children, mobile = false, icon: Icon, onClick, showBadge = false, badgeCount = 0 }) {
  return (
    <div className="relative">
      <NavLink
        to={to}
        end
        onClick={onClick}
        className={({ isActive }) =>
          mobile
            ? `group flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#B77466] to-[#A3665A] text-white shadow-lg shadow-[#B77466]/30' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/20 hover:to-[#E2B59A]/20 hover:text-[#957C62]'
              }`
            : `group relative flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-[#957C62] bg-gradient-to-r from-[#FFE1AF]/30 to-[#E2B59A]/30 shadow-sm' 
                  : 'text-gray-700 hover:text-[#957C62] hover:bg-gradient-to-r hover:from-[#FFE1AF]/10 hover:to-[#E2B59A]/10'
              }`
        }
      >
        {({ isActive }) => (
          <>
            {Icon && (
              <Icon className={`${mobile ? 'w-5 h-5' : 'w-4 h-4'} ${
                isActive ? 'text-current' : 'text-gray-500 group-hover:text-[#B77466]'
              } transition-colors duration-300`} />
            )}
            <span>{children}</span>
            {!mobile && isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-[#B77466] to-[#957C62] rounded-full"></div>
            )}
          </>
        )}
      </NavLink>
      {showBadge && badgeCount > 0 && (
        <span className={`absolute ${
          mobile 
            ? 'right-4 top-1/2 -translate-y-1/2' 
            : '-top-1 -right-1'
        } w-5 h-5 bg-gradient-to-br from-[#B77466] to-[#957C62] text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm`}>
          {badgeCount}
        </span>
      )}
    </div>
  )
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(sessionStorage.getItem('email')))
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [userRole, setUserRole] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Helper function to update auth state
  const updateAuthState = () => {
    const email = sessionStorage.getItem('email')
    const role = sessionStorage.getItem('role')
    setIsAuthenticated(!!email)
    if (role) setUserRole(role)
    else setUserRole('')
  }

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      updateAuthState()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Check auth state on mount and periodically
  useEffect(() => {
    updateAuthState()
    
    const interval = setInterval(() => {
      updateAuthState()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch cart count if authenticated
  useEffect(() => {
    if (isAuthenticated && userRole === 'USER') {
      // You can fetch actual cart count here
      setCartCount(3)
      setWishlistCount(5)
    } else {
      setCartCount(0)
      setWishlistCount(0)
    }
  }, [isAuthenticated, userRole])

  const handleLogout = () => {
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('role')
    setIsAuthenticated(false)
    setIsMenuOpen(false)
    navigate('/login')
  }

  const canAccess = (requiredRoles) => {
    if (!userRole) return false
    return requiredRoles.includes(userRole)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50 border-b border-[#E2B59A]/20' 
        : 'bg-white border-b border-[#E2B59A]/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative w-12 h-12 bg-gradient-to-br from-[#B77466] to-[#957C62] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Sofa className="w-7 h-7 text-white" />
               
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#957C62] to-[#B77466] bg-clip-text text-transparent">
                  FurniCraft
                </span>
                <div className="text-xs text-gray-500 font-medium -mt-1">Premium Furniture</div>
              </div>
            </NavLink>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search furniture, collections..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#E2B59A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B77466]/30 focus:border-[#B77466]/50 text-gray-700 placeholder-gray-400 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-[#B77466] to-[#957C62] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation & User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-[#FFE1AF]/10 to-[#E2B59A]/10 rounded-2xl p-1.5 border border-[#E2B59A]/20">
              <NavItem to="/" icon={Home}>Home</NavItem>
              <NavItem to="/items" icon={Grid}>Item</NavItem>
              <NavItem to="/categories" icon={Package}>Collections</NavItem>

              {/* Orders - USER only */}
              {canAccess(['USER']) && (
                <NavItem to="/orders" icon={ShoppingBag}>Orders</NavItem>
              )}

              {/* All Orders - ADMIN only */}
              {canAccess(['ADMIN']) && (
                <NavItem to="/adminorder" icon={ListOrdered}>Orders</NavItem>
              )}
              
              {/* Delivery Dashboard - DELIVERY_MAN only */}
              {canAccess(['DELIVERY_MAN']) && (
                <NavItem to="/delivery" icon={Truck}>Delivery</NavItem>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Wishlist - USER only */}
              {canAccess(['USER']) && (
                <div className="relative">
                  <NavLink
                    to="/wl"
                    className="p-2.5 rounded-xl  transition-all duration-300 group"
                  >
                    <Heart className="w-5 h-5 text-gray-600 transition-colors" />
                    
                  </NavLink>
                </div>
              )}

              {/* Cart - USER only */}
              {canAccess(['USER']) && (
                <div className="relative">
                  <NavLink
                    to="/cart"
                    className="p-2.5 rounded-xl  transition-all duration-300 group"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-600  transition-colors" />
                    
                  </NavLink>
                </div>
              )}

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE1AF]/10 to-[#E2B59A]/10 hover:from-[#FFE1AF]/20 hover:to-[#E2B59A]/20 transition-all duration-300 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#B77466] to-[#957C62] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-[#957C62] transition-colors" />
                </button>
                
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl shadow-gray-300/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 border border-[#E2B59A]/20">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-[#E2B59A]/10">
                        <div className="text-sm font-semibold text-[#957C62]">Welcome!</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {userRole === 'DELIVERY_MAN' ? 'Delivery Partner' : userRole || 'User'}
                        </div>
                      </div>
                      
                      <NavLink 
                        to="/profile" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/10 hover:to-[#E2B59A]/10 hover:text-[#957C62] transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </NavLink>
                      
                      {/* Admin Actions */}
                      {canAccess(['ADMIN']) && (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                            Admin Panel
                          </div>
                          <NavLink 
                            to="/categories/add" 
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/10 hover:to-[#E2B59A]/10 hover:text-[#957C62] transition-all duration-200 ml-4"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Category</span>
                          </NavLink>
                          <NavLink 
                            to="/subcategories/add"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/10 hover:to-[#E2B59A]/10 hover:text-[#957C62] transition-all duration-200 ml-4"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add SubCategory</span>
                          </NavLink>
                          <NavLink 
                            to="/items/add"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/10 hover:to-[#E2B59A]/10 hover:text-[#957C62] transition-all duration-200 ml-4"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Item</span>
                          </NavLink>
                        </>
                      )}
                      
                      <div className="border-t border-[#E2B59A]/10 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 transition-all duration-200 rounded-lg"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <NavLink 
                        to="/login" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/10 hover:to-[#E2B59A]/10 hover:text-[#957C62] transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>Login</span>
                      </NavLink>
                      <NavLink 
                        to="/register" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/10 hover:to-[#E2B59A]/10 hover:text-[#957C62] transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>Register</span>
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Search Icon for Mobile */}
            <button className="p-2 rounded-lg hover:bg-[#FFE1AF]/20 transition-colors">
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Cart Badge for mobile - USER only */}
            {isAuthenticated && canAccess(['USER']) && cartCount > 0 && (
              <NavLink to="/cart" className="relative p-2 rounded-lg hover:bg-[#FFE1AF]/20 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#B77466] to-[#957C62] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              </NavLink>
            )}
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-[#957C62] hover:bg-[#FFE1AF]/20 focus:outline-none transition-all duration-300"
            >
              {!isMenuOpen ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-t border-[#E2B59A]/20 transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pt-4 pb-6 space-y-4">
          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#E2B59A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B77466]/30 focus:border-[#B77466]/50 text-gray-700 placeholder-gray-400"
              />
            </div>
          </form>

          {/* Main Links */}
          <div className="space-y-1">
            <NavItem to="/" mobile icon={Home} onClick={() => setIsMenuOpen(false)}>
              Home
            </NavItem>
            
            <NavItem to="/categories" mobile icon={Grid} onClick={() => setIsMenuOpen(false)}>
              Shop
            </NavItem>
            
            <NavItem to="/items" mobile icon={Package} onClick={() => setIsMenuOpen(false)}>
              Collections
            </NavItem>
            
            {/* All Orders - ADMIN only */}
            {canAccess(['ADMIN']) && (
              <NavItem to="/adminorder" mobile icon={ListOrdered} onClick={() => setIsMenuOpen(false)}>
                All Orders
              </NavItem>
            )}
            
            {/* Orders - USER only */}
            {canAccess(['USER']) && (
              <NavItem to="/orders" mobile icon={ShoppingBag} onClick={() => setIsMenuOpen(false)}>
                My Orders
              </NavItem>
            )}
            
            {/* Delivery Dashboard - DELIVERY_MAN only */}
            {canAccess(['DELIVERY_MAN']) && (
              <NavItem to="/delivery" mobile icon={Truck} onClick={() => setIsMenuOpen(false)}>
                Delivery Dashboard
              </NavItem>
            )}
            
            {/* Wishlist - USER only */}
            {canAccess(['USER']) && (
              <NavItem to="/wl" mobile icon={Heart} onClick={() => setIsMenuOpen(false)}>
                Wishlist
              </NavItem>
            )}
            
            {/* Cart - USER only */}
            {canAccess(['USER']) && (
              <NavItem to="/cart" mobile icon={ShoppingCart} onClick={() => setIsMenuOpen(false)}>
                Cart
              </NavItem>
            )}
          </div>

          {/* Admin Actions Section - ADMIN only */}
          {canAccess(['ADMIN']) && (
            <div className="pt-4 border-t border-[#E2B59A]/20">
              <div className="px-4 py-3 text-xs font-bold text-[#957C62] uppercase tracking-wider flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Admin Panel</span>
              </div>
              
              <div className="space-y-2">
                <NavLink 
                  to="/categories/add" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/20 hover:to-[#E2B59A]/20 hover:text-[#957C62] rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFE1AF] to-[#E2B59A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Grid className="w-4 h-4 text-[#957C62]" />
                  </div>
                  <div>
                    <div className="font-semibold">Add Category</div>
                  </div>
                </NavLink>
                
                <NavLink 
                  to="/subcategories/add"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/20 hover:to-[#E2B59A]/20 hover:text-[#957C62] rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFE1AF] to-[#E2B59A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Layers className="w-4 h-4 text-[#957C62]" />
                  </div>
                  <div>
                    <div className="font-semibold">Add SubCategory</div>
                  </div>
                </NavLink>
                
                <NavLink 
                  to="/items/add"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#FFE1AF]/20 hover:to-[#E2B59A]/20 hover:text-[#957C62] rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFE1AF] to-[#E2B59A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-[#957C62]" />
                  </div>
                  <div>
                    <div className="font-semibold">Add Item</div>
                  </div>
                </NavLink>
              </div>
            </div>
          )}

          {/* Authentication Section */}
          <div className="pt-4 border-t border-[#E2B59A]/20">
            {!isAuthenticated ? (
              <div className="space-y-3">
                <NavLink 
                  to="/login" 
                  className="block w-full text-center px-6 py-3 rounded-xl text-base font-semibold text-gray-700 bg-gradient-to-r from-[#FFE1AF]/10 to-[#E2B59A]/10 hover:from-[#FFE1AF]/20 hover:to-[#E2B59A]/20 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="block w-full text-center px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#B77466] to-[#957C62] hover:from-[#A3665A] hover:to-[#846B55] transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </NavLink>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="px-4 py-4 bg-gradient-to-r from-[#FFE1AF]/10 to-[#E2B59A]/10 rounded-xl border border-[#E2B59A]/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#B77466] to-[#957C62] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#957C62]">Welcome!</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {userRole === 'DELIVERY_MAN' ? 'Delivery Partner' : userRole || 'User'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <NavLink 
                    to="/profile" 
                    className="text-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gradient-to-r from-[#FFE1AF]/10 to-[#E2B59A]/10 hover:from-[#FFE1AF]/20 hover:to-[#E2B59A]/20 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 hover:text-red-600 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}