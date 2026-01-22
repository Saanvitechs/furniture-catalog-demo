import { Link, useNavigate } from 'react-router-dom'
import { 
  ChevronRight, 
  Star, 
  Shield, 
  Truck, 
  Award, 
  ChevronLeft, 
  ChevronRight as ChevronRightIcon,
  Sofa, 
  Tv, 
  Layout, 
  X,
  Bed, 
  Armchair, 
  Palette,
  Heart,
  ShoppingCart,
  Users,
  CheckCircle,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Import your dummy data
import { dummyCategories, dummySubCategories, dummyItems } from '../services/dummyData'

// Framer Motion variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.6 }
}

// Random furniture facts
const furnitureFacts = [
  {
    fact: "The oldest known chairs date back to Ancient Egypt around 2680 BCE",
    icon: Clock
  },
  {
    fact: "Ergonomic chairs can increase productivity by up to 17%",
    icon: TrendingUp
  },
  {
    fact: "The term 'armchair' first appeared in the 1630s",
    icon: Armchair
  },
  {
    fact: "Modern office chairs were invented by Charles Darwin",
    icon: Zap
  }
]

// Hero Banner with multiple background images
function HeroBanner() {
  const images = [
    "https://i.pinimg.com/1200x/e5/c2/1e/e5c21e6e451d2051deb8972013b2494b.jpg",
    "https://i.pinimg.com/1200x/41/ca/1d/41ca1d627390543a1ed078ec8d23fce3.jpg",
    "https://i.pinimg.com/1200x/1c/b0/d8/1cb0d89795f3bd078ad40e87db898a82.jpg"
  ]
  
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with fade transition */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentImage === index ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src={src}
              alt={`Modern living room ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentImage === index 
                  ? 'w-8 bg-white' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl text-white"
        >
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center text-sm font-semibold tracking-widest uppercase mb-4 text-[#FFE1AF]"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Premium Furniture Collection
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            Crafted for <br />
            <span className="text-[#FFE1AF]">Comfort &</span> Style
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-200 mb-8 max-w-xl leading-relaxed"
          >
            Experience the perfect blend of luxury, comfort, and timeless design with our handcrafted furniture collections.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/categories"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-[#B77466] hover:bg-[#A3665A] text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Collections
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <Link
              to="/about"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white text-white rounded-lg transition-all duration-300 hover:bg-white/20"
            >
              Our Story
              <ChevronRight className="ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20"
          >
            {[
              { value: "25K+", label: "Premium Chairs Delivered", color: "text-[#FFE1AF]" },
              { value: "98%", label: "Customer Satisfaction", color: "text-white" },
              { value: "15+", label: "Years of Excellence", color: "text-[#FFE1AF]" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <ChevronRight className="w-8 h-8 text-white/80 rotate-90" />
      </motion.div>
    </section>
  )
}

// Enhanced Product Gallery with fixed Drop Chair issue
function ProductGallery() {
  const [activeProduct, setActiveProduct] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  const products = [
    {
      id: 1,
      title: "Drop Chair",
      subtitle: "The Yellow leather edition",
      description: "Stunning piece of furniture that combines modern design with classic elegance. Its sleek, minimalist lines are perfect for any space. The chair is not only stylish but also exceptionally comfortable with premium leather upholstery.",
      price: "Rs 299.99",
      originalPrice: "Rs 399.99",
      image: "https://i.pinimg.com/736x/12/20/16/122016e5f163c4cc5495c243296b6bce.jpg",
      features: ["Modern Design", "Premium Leather", "Ergonomic Support", "Easy Assembly"],
      category: "Chairs"
    },
    {
      id: 2,
      title: "Nova Lounge Chair",
      subtitle: "Contemporary Comfort Redefined",
      description: "Experience ultimate relaxation with the Nova Chair, featuring ergonomic design and premium materials for long-lasting comfort. Perfect for living rooms and offices.",
      price: "Rs 349.99",
      originalPrice: "Rs 449.99",
      image: "https://i.pinimg.com/736x/65/dc/e6/65dce695aaa9ea3c95c63372b18d146d.jpg",
      features: ["Ergonomic Design", "Premium Materials", "Swivel Base", "5-Year Warranty"],
      category: "Armchairs"
    },
    {
      id: 3,
      title: "Classic Armchair",
      subtitle: "Timeless Elegance & Craftsmanship",
      description: "A perfect blend of traditional craftsmanship and modern comfort, designed for sophisticated living spaces. Handcrafted by master artisans.",
      price: "Rs 459.99",
      originalPrice: "Rs 549.99",
      image: "https://i.pinimg.com/736x/b5/2e/0d/b52e0d86a14aa9534a55ee21a96531d4.jpg",
      features: ["Handcrafted", "Luxury Fabric", "Solid Wood Frame", "Heirloom Quality"],
      category: "Armchairs"
    },
    {
      id: 4,
      title: "Modern Sectional",
      subtitle: "Modular Luxury Sofa",
      description: "Transform your living space with our modular sectional sofa. Customizable configuration with premium memory foam cushions.",
      price: "Rs 1,299.99",
      originalPrice: "Rs 1,599.99",
      image: "https://i.pinimg.com/1200x/41/ca/1d/41ca1d627390543a1ed078ec8d23fce3.jpg",
      features: ["Modular Design", "Memory Foam", "Washable Covers", "10-Year Warranty"],
      category: "Sofas"
    }
  ]

  const categories = ["All", "Chairs", "Armchairs", "Sofas"]

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-px bg-[#B77466] mr-4"></div>
            <span className="text-sm font-semibold text-[#957C62] uppercase tracking-widest">Featured Collection</span>
            <div className="w-12 h-px bg-[#B77466] ml-4"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#957C62] mb-6">
            Curated Excellence
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our signature pieces that define modern luxury living
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCategory(category)
                setActiveProduct(0)
              }}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-[#B77466] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Navigation with Icons */}
        <div className="flex flex-wrap gap-4 mb-16 justify-center">
          {[
            { icon: Sofa, label: "Sofas", desc: "Luxury seating solutions" },
            { icon: Armchair, label: "Armchairs", desc: "Comfortable lounge chairs" },
            { icon: Layout, label: "Chairs", desc: "Modern chairs for every space" },
            { icon: Bed, label: "Drop Chair", desc: "Iconic yellow leather edition" }
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveProduct(index)}
                className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 ${
                  activeProduct === index 
                    ? 'bg-gradient-to-br from-[#FFE1AF] to-[#E2B59A] border-2 border-[#B77466] shadow-xl' 
                    : 'bg-white border-2 border-gray-100 hover:border-[#E2B59A] shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`p-4 rounded-xl mb-4 ${
                  activeProduct === index ? 'bg-white' : 'bg-gray-50'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    activeProduct === index ? 'text-[#B77466]' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className={`font-bold text-lg mb-1 ${
                  activeProduct === index ? 'text-[#957C62]' : 'text-gray-800'
                }`}>{item.label}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.button>
            )
          })}
        </div>

        {/* Active Product Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Product Image with Enhanced Display */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src={filteredProducts[activeProduct]?.image || products[0].image}
                  alt={filteredProducts[activeProduct]?.title || products[0].title}
                  className="w-full h-[600px] object-cover"
                />
                {/* Price Tag */}
                <div className="absolute top-6 right-6 bg-white px-6 py-3 rounded-xl shadow-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#B77466]">
                      {filteredProducts[activeProduct]?.price || products[0].price}
                    </span>
                    {filteredProducts[activeProduct]?.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {filteredProducts[activeProduct]?.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Free Shipping</div>
                </div>
                
                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-[#B77466] text-white text-sm font-semibold rounded-full">
                    Best Seller
                  </span>
                </div>
              </div>
              
              {/* Image Navigation Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {filteredProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveProduct(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeProduct === idx 
                        ? 'w-8 bg-[#B77466]' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <span className="text-sm font-semibold text-[#957C62] uppercase tracking-wider">
                  {filteredProducts[activeProduct]?.category || products[0].category}
                </span>
                <h3 className="text-4xl md:text-5xl font-bold text-[#957C62] mt-2 mb-4">
                  {filteredProducts[activeProduct]?.title || products[0].title}
                </h3>
                <p className="text-gray-600 text-xl mb-6">
                  {filteredProducts[activeProduct]?.subtitle || products[0].subtitle}
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {filteredProducts[activeProduct]?.description || products[0].description}
                </p>
              </div>
              
              {/* Features */}
              <div className="mb-10">
                <h4 className="text-lg font-semibold text-[#957C62] mb-4">Key Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(filteredProducts[activeProduct]?.features || products[0].features).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#B77466] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Random Furniture Fact */}
              <div className="mb-8 p-6 bg-gradient-to-r from-[#FFE1AF]/20 to-[#E2B59A]/20 rounded-2xl border border-[#E2B59A]">
                <div className="flex items-start space-x-4">
                  {(() => {
                    const Icon = furnitureFacts[activeProduct % furnitureFacts.length].icon
                    return <Icon className="w-6 h-6 text-[#B77466] mt-1 flex-shrink-0" />
                  })()}
                  <div>
                    <p className="text-sm font-semibold text-[#957C62] mb-1">Did You Know?</p>
                    <p className="text-gray-700">
                      {furnitureFacts[activeProduct % furnitureFacts.length].fact}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                
                
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// Enhanced Categories Section
function CategoriesSection() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      const fetchedCategories = dummyCategories.data || []
      setCategories(fetchedCategories)
      if (fetchedCategories.length > 0) {
        setActiveCategory(fetchedCategories[0].categoryName)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-px bg-[#B77466] mr-4"></div>
            <span className="text-sm font-semibold text-[#957C62] uppercase tracking-widest">Collections</span>
            <div className="w-12 h-px bg-[#B77466] ml-4"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#957C62] mb-6">
            Explore by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover curated collections designed for every room and style preference
          </p>
        </motion.div>

        {/* Scrollable Categories */}
        <div className="relative mb-20">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6 text-[#957C62]" />
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hidden md:flex"
          >
            <ChevronRight className="w-6 h-6 text-[#957C62]" />
          </button>

          {/* Categories Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth space-x-8 pb-8 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-72 snap-center">
                  <div className="animate-pulse">
                    <div className="w-72 h-64 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))
            ) : categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                onClick={() => {
                  setActiveCategory(category.categoryName)
                  navigate('/categories')
                }}
                className="flex-shrink-0 w-72 cursor-pointer snap-center"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 group">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <img 
                      src={category.image}
                      alt={category.categoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ChevronRight className="w-5 h-5 mb-2" />
                    <p className="text-sm font-medium">View Collection</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#957C62] mb-3">{category.categoryName}</h3>
                  <p className="text-gray-600 text-sm mb-4">Premium collection</p>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    viewport={{ once: true }}
                    className="h-1 bg-gradient-to-r from-[#B77466] to-[#957C62] mx-auto rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Subcategories for active category */}
        {activeCategory && dummySubCategories[activeCategory] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-[#957C62]">
                  {activeCategory} Collection
                </h3>
                <p className="text-gray-600 mt-2">
                  Explore premium {activeCategory.toLowerCase()} for your space
                </p>
              </div>
              <Link
                to="/categories"
                className="text-[#B77466] hover:text-[#A3665A] font-semibold flex items-center group"
              >
                View All
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dummySubCategories[activeCategory].slice(0, 3).map((subcategory, index) => (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => navigate('/categories')}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E2B59A] cursor-pointer group"
                >
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={subcategory.image}
                      alt={subcategory.subCategoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-[#957C62]">
                        {subcategory.subCategoryName}
                      </h4>
                      <ChevronRight className="w-5 h-5 text-[#B77466] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Premium {subcategory.parentName.toLowerCase()} collection
                    </p>
                    <div className="flex items-center text-[#B77466] text-sm font-medium">
                      Explore Collection
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Enhanced Interactive Showroom
function FurnitureDisplay() {
  const [activeFurniture, setActiveFurniture] = useState('sofa')
  
  const furnitureItems = [
    {
      id: 'sofa',
      name: 'Luxury Sofa',
      image: 'https://i.pinimg.com/1200x/41/ca/1d/41ca1d627390543a1ed078ec8d23fce3.jpg',
      icon: Sofa,
      color: 'text-[#B77466]',
      bgColor: 'bg-[#FFE1AF]',
      borderColor: 'border-[#E2B59A]',
      description: 'Premium velvet sofa with memory foam cushions'
    },
    {
      id: 'tvtable',
      name: 'Modern TV Console',
      image: 'https://i.pinimg.com/1200x/1c/b0/d8/1cb0d89795f3bd078ad40e87db898a82.jpg',
      icon: Tv,
      color: 'text-[#957C62]',
      bgColor: 'bg-[#E2B59A]',
      borderColor: 'border-[#957C62]',
      description: 'Sleek wooden console with smart storage'
    },
    {
      id: 'largesofa',
      name: 'Sectional Sofa',
      image: 'https://i.pinimg.com/1200x/e5/c2/1e/e5c21e6e451d2051deb8972013b2494b.jpg',
      icon: Layout,
      color: 'text-[#957C62]',
      bgColor: 'bg-[#E2B59A]',
      borderColor: 'border-[#957C62]',
      description: 'Modular L-shaped sofa with chaise lounge'
    }
  ]

  const activeItem = furnitureItems.find(item => item.id === activeFurniture)

 
}

// Enhanced Featured Products
function FeaturedProducts() {
  const [featuredItems, setFeaturedItems] = useState([])

  useEffect(() => {
    const allItems = Object.values(dummyItems).flat()
    setFeaturedItems(allItems.slice(0, 6))
  }, [])

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-px bg-[#B77466] mr-4"></div>
            <span className="text-sm font-semibold text-[#957C62] uppercase tracking-widest">Best Sellers</span>
            <div className="w-12 h-px bg-[#B77466] ml-4"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#957C62] mb-6">
            Customer Favorites
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our most loved furniture pieces chosen by thousands of satisfied customers
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:border-[#E2B59A] transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={item.photos[0]}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FFE1AF] transition-colors">
                    <Heart className="w-5 h-5 text-[#957C62]" />
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FFE1AF] transition-colors">
                    <ShoppingCart className="w-5 h-5 text-[#957C62]" />
                  </button>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#957C62] text-xs font-semibold rounded-full">
                    {item.categoryName}
                  </span>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-[#957C62] truncate">{item.name}</h3>
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#B77466]">₹{item.price.toLocaleString()}</span>
                    <div className="text-xs text-gray-500">Free Shipping</div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-[#FFE1AF] to-[#E2B59A] text-[#957C62] font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/categories"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#B77466] to-[#A3665A] hover:from-[#A3665A] hover:to-[#957C62] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <span>View All Products</span>
            <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Enhanced Stats Section
function StatsSection() {
  const stats = [
    { 
      value: "25K+", 
      label: "Premium Chairs Delivered", 
      icon: Truck,
      description: "Within two weeks guaranteed" 
    },
    { 
      value: "15K+", 
      label: "Design Solutions", 
      icon: Award,
      description: "Custom furniture designs" 
    },
    { 
      value: "20K+", 
      label: "Happy Customers", 
      icon: Users,
      description: "98% satisfaction rate" 
    },
    { 
      value: "10+", 
      label: "Years Experience", 
      icon: Shield,
      description: "In furniture craftsmanship" 
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-[#FFE1AF] via-[#F8D49E] to-[#E2B59A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-white/20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFE1AF] to-[#E2B59A] rounded-2xl mb-6 shadow-lg">
                  <Icon className="w-10 h-10 text-[#B77466]" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#957C62] mb-2">
                  {stat.value}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {stat.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
        
        {/* Furniture Facts Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-[#957C62] mb-8 text-center">
            Furniture Fun Facts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {furnitureFacts.map((fact, index) => {
              const Icon = fact.icon
              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-2xl bg-white/50">
                  <div className="p-3 bg-[#FFE1AF] rounded-xl">
                    <Icon className="w-6 h-6 text-[#B77466]" />
                  </div>
                  <p className="text-gray-700 flex-1">{fact.fact}</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFE1AF] via-[#F8D49E] to-[#E2B59A]"></div>
         <div
  className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
></div>

          
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6"
            >
              Limited Time Offer
            </motion.span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Transform Your Space Today
            </h2>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get <span className="font-bold">15% OFF</span> on your first order! 
              Use code: <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">WELCOME15</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/categories"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-[#B77466] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                Shop Now & Save
                <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-transparent text-white border-2 border-white/40 hover:border-white rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                Book Free Consultation
                <ChevronRight className="ml-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </div>
            
            <p className="text-white/70 text-sm mt-8">
              Offer valid until December 31st. Free shipping on all orders.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Banner with multiple images */}
      <HeroBanner />
      
      {/* Product Gallery with fixed Drop Chair issue */}
      <ProductGallery />
      
      {/* Categories Section */}
      <CategoriesSection />
      
      {/* Interactive Showroom */}
      <FurnitureDisplay />
      
      {/* Stats Section with facts */}
      <StatsSection />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Custom styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #B77466, #957C62);
          border-radius: 10px;
          border: 2px solid #f8f9fa;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #A3665A, #846B55);
        }
        
        /* Snapping for categories */
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        
        .snap-center {
          scroll-snap-align: center;
        }
        
        /* Selection styles */
        ::selection {
          background-color: rgba(183, 116, 102, 0.3);
          color: #957C62;
        }
        
        /* Smooth animations */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Image optimization */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  )
}