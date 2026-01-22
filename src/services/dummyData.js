// Dummy data service for demo purposes

// Dummy Categories
export const dummyCategories = {
  data: [
    { id: 1, categoryName: 'Sofa', image: '/dummyimages/furniture_1_520x298.png' },
    { id: 2, categoryName: 'Chair', image: '/dummyimages/furniture_8_520x298.png' },
    { id: 3, categoryName: 'TV Stand', image: '/dummyimages/furniture_2_520x298.png' },
    { id: 4, categoryName: 'Table', image: '/dummyimages/furniture_4_520x298.png' },
  ]
};

// Dummy Subcategories by Category with images
export const dummySubCategories = {
  'Sofa': [
    { id: 1, subCategoryName: '3-Seater Sofa', parentName: 'Sofa', image: '/dummyimages/furniture_6_520x298.png' },
    { id: 2, subCategoryName: 'Sectional Sofa', parentName: 'Sofa', image: '/dummyimages/furniture_3_520x298.png' },
    { id: 3, subCategoryName: 'Corner Sofa', parentName: 'Sofa', image: '/dummyimages/furniture_5_520x298.png' },
  ],
  'Chair': [
    { id: 4, subCategoryName: 'Dining Chair', parentName: 'Chair', image: '/dummyimages/furniture_10_520x298.png' },
    { id: 5, subCategoryName: 'Office Chair', parentName: 'Chair', image: '/dummyimages/furniture_8_520x298.png' },
    { id: 6, subCategoryName: 'Armchair', parentName: 'Chair', image: '/dummyimages/furniture_9_520x298.png' },
  ],
  'TV Stand': [
    { id: 7, subCategoryName: 'Wooden Stand', parentName: 'TV Stand', image: '/dummyimages/furniture_11_520x298.png' },
    { id: 8, subCategoryName: 'Steel Stand', parentName: 'TV Stand', image: '/dummyimages/furniture_12_520x298.png' },
  ],
  'Table': [
    { id: 9, subCategoryName: 'Coffee Table', parentName: 'Table', image: '/dummyimages/furniture_13_520x298.png' },
    { id: 10, subCategoryName: 'Dining Table', parentName: 'Table', image: '/dummyimages/furniture_14_520x298.png' },
  ],
};

// Dummy Items/Products with images
export const dummyItems = {
  '3-Seater Sofa': [
    {
      id: 1,
      name: 'Premium 3-Seater Sofa',
      price: 35000,
      description: 'High-quality grey fabric sofa with superior comfort',
      photos: ['https://pelicanessentials.com/cdn/shop/files/three_seater_grey_0002Photoroom.jpg?v=1751589493&width=2048'],
      categoryName: 'Sofa',
      subcategoryName: '3-Seater Sofa'
    },
  ],
  
};


// Dummy User Data
export const dummyUsers = {
  'rajesh@example.com': {
    email: 'rajesh@example.com',
    role: 'USER'
  },
  'admin@example.com': {
    email: 'admin@example.com',
    role: 'ADMIN'
  }
};

// Dummy Cart Data
// Compact Dummy Cart Data
export const dummyCartItems = [

  {
    id: 11,
    name: 'Wooden Dining Chairs (Set of 4)',
    price: 12000,
    quantity: 1,
    photos: ['https://ganpatiarts.com/cdn/shop/files/Dining_6_natural_8.jpg?v=1765796531&width=400'],
    categoryName: 'Chair',
    subcategoryName: 'Dining Chair'
  }

];

// Dummy Addresses
export const dummyAddresses = [
  {
    id: 1,
    street: 'Flat 4B, Emerald Heights, Park Road, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400069',
    country: 'India'
  },
  {
    id: 2,
    street: 'Plot 56, New Delhi Nagar, Near Metro Station',
    city: 'Delhi',
    state: 'Delhi',
    zipCode: '110001',
    country: 'India'
  }
];


// Dummy Wishlist
export const dummyWishlist = new Set([2, 12]);

// Dummy Orders
export const dummyOrders = [
  {
    id: 'ORD-001',
    date: '2026-01-20',
    status: 'Ready for Delivery',
    items: [
      { 
        id: 1,
        name: 'Premium 3-Seater Sofa', 
        quantity: 1, 
        price: 35000,
        image: 'https://pelicanessentials.com/cdn/shop/files/three_seater_grey_0002Photoroom.jpg?v=1751589493&width=300'
      }
]}
]

// API Response helpers
export const apiResponse = {
  success: (data) => ({
    status: 'success',
    data: data
  }),
  error: (message) => ({
    status: 'error',
    message: message
  })
};

// Mock delay to simulate network request
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
