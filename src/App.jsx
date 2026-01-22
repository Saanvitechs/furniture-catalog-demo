import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Items from './pages/Items'
import AddCategory from './pages/AddCategory'
import AddSubcategory from './pages/AddSubcategory'
import AddItem from './pages/AddItem'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RequireAuth from './components/RequireAuth'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import Order from './pages/Order'
import DeliveryDashboard from './pages/DeliveryDashboard'
import UserProfile from './pages/UserProfile'
import AdminOrders from './pages/Adminorder'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>

          {/* ✅ PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/items" element={<Items />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          {/* 🔒 PROTECTED ROUTES */}
          <Route path="/wl" element={<RequireAuth><WishlistPage /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Order /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />

          {/* 🔒 ADMIN */}
          <Route path="/categories/add" element={<RequireAuth><AddCategory /></RequireAuth>} />
          <Route path="/subcategories/add" element={<RequireAuth><AddSubcategory /></RequireAuth>} />
          <Route path="/items/add" element={<RequireAuth><AddItem /></RequireAuth>} />
          <Route path="/adminorder" element={<RequireAuth><AdminOrders /></RequireAuth>} />

          {/* 🔒 DELIVERY */}
          <Route path="/delivery" element={<RequireAuth><DeliveryDashboard /></RequireAuth>} />

        </Routes>
      </div>
    </BrowserRouter>
  )
}
