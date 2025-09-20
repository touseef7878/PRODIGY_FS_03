import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { ShoppingCart, Search, Heart, Star, Plus, Minus, Trash2, User, Package, CreditCard, MapPin, Phone, Mail, Filter, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

// Mock API Base URL
const API_BASE = 'http://localhost:5000/api';

// Cart Context
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

export const CartProvider = ({ children, setCurrentPage }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const goToCheckout = () => {
    setIsOpen(false);
    setCurrentPage('checkout');
  };

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      setIsOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      goToCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Mock Data
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 8999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    stock: 15
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    description: "Soft and comfortable organic cotton t-shirt available in multiple colors.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Clothing",
    rating: 4.2,
    reviews: 85,
    stock: 32
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
    price: 12999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.7,
    reviews: 203,
    stock: 8
  },
  {
    id: 4,
    name: "Artisan Coffee Beans",
    description: "Premium roasted coffee beans sourced from the finest plantations.",
    price: 1599,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    category: "Food",
    rating: 4.8,
    reviews: 167,
    stock: 24
  },
  {
    id: 5,
    name: "Minimalist Backpack",
    description: "Sleek and functional backpack perfect for work, travel, and everyday use.",
    price: 3999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.4,
    reviews: 94,
    stock: 18
  },
  {
    id: 6,
    name: "Ceramic Plant Pot",
    description: "Beautiful handcrafted ceramic pot perfect for your indoor plants.",
    price: 899,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    category: "Home",
    rating: 4.3,
    reviews: 76,
    stock: 45
  }
];

const mockReviews = [
  { id: 1, productId: 1, user: "Ahmad Khan", rating: 5, comment: "Excellent sound quality! Worth every penny.", date: "2024-09-15" },
  { id: 2, productId: 1, user: "Sarah Ali", rating: 4, comment: "Good headphones but could be more comfortable.", date: "2024-09-10" },
  { id: 3, productId: 2, user: "Hassan Ahmed", rating: 5, comment: "Super soft fabric and great fit!", date: "2024-09-12" },
];

// Components
const Header = ({ currentPage, setCurrentPage, searchQuery, setSearchQuery }) => {
  const { getTotalItems, setIsOpen } = useCart();

  return (
    <header>
      <div className="header-content">
        <div className="logo" onClick={() => setCurrentPage('home')}>
          LocalStore
        </div>
        <nav>
          <ul>
            <li>
              <button
                onClick={() => setCurrentPage('admin')}
                className={`admin-nav-button ${currentPage === 'admin' ? 'active' : ''}`}
              >
                Admin
              </button>
            </li>
          </ul>
        </nav>

        <div className="search-container">
          <div className="search-icon">
            <Search />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="cart-button"
        >
          <ShoppingCart />
          {getTotalItems() > 0 && (
            <span className="cart-count">
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        <span className="product-badge">
          {product.category}
        </span>
        <div className="absolute top-4 right-4">
          <button>
            <Heart />
          </button>
        </div>
      </div>
      
      <div className="product-content">
        <div className="product-rating">
          <Star className="star-icon" />
          <span>{product.rating}</span>
        </div>
        
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div>
            <span className="product-price">₨{product.price.toLocaleString()}</span>
            <p>{product.reviews} reviews</p>
          </div>
          <div className="product-actions">
            <button
              onClick={() => onViewDetails(product)}
              className="btn-view"
            >
              View
            </button>
            <button
              onClick={() => addToCart(product)}
              className="btn-add-cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail = ({ product, onBack }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const productReviews = mockReviews.filter(review => review.productId === product.id);
  const images = [product.image]; // In real app, products would have multiple images

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button
          onClick={onBack}
          className="back-btn"
        >
          <ArrowLeft className="mr-2" />
          Back to Products
        </button>

        <div className="product-detail-card">
          <div className="product-detail-grid">
            {/* Images */}
            <div className="product-detail-images">
              <div className="product-detail-image-container">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="product-detail-main-image"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-detail-info">
              <span className="product-detail-badge">
                {product.category}
              </span>
              
              <h1 className="product-detail-title">{product.name}</h1>
              
              <div className="product-detail-rating">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`rating-star ${i < Math.floor(product.rating) ? 'fill' : ''}`} />
                  ))}
                </div>
                <span className="rating-count">{product.rating} ({product.reviews} reviews)</span>
              </div>

              <div className="product-detail-price-container">
                <span className="product-detail-price">₨{product.price.toLocaleString()}</span>
                <p className="stock-status">In Stock ({product.stock} available)</p>
              </div>

              <div className="quantity-selector">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn-detail"
                  >
                    <Minus />
                  </button>
                  <span className="quantity-value-detail">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="quantity-btn-detail"
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              <div className="product-detail-actions">
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart(product);
                    }
                  }}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
                <button className="wishlist-btn">
                  <Heart />
                </button>
              </div>

              {/* Tabs */}
              <div className="tabs">
                <div className="tab-buttons">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                {activeTab === 'description' && (
                  <div className="tab-content">
                    <p>{product.description}</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="tab-content">
                    {productReviews.map(review => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <span className="review-user">{review.user}</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`rating-star ${i < review.rating ? 'fill' : ''}`} />
                            ))}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <span className="review-date">{review.date}</span>
                      </div>
                    ))}
                    {productReviews.length === 0 && (
                      <p className="no-reviews">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSidebar = () => {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, getTotalPrice, goToCheckout } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar">
      <div className="cart-backdrop" onClick={() => setIsOpen(false)} />
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="cart-close-btn"
          >
            <X />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart className="cart-empty-icon" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">₨{item.price.toLocaleString()}</p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        <Minus />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-price">₨{getTotalPrice().toLocaleString()}</span>
            </div>
            <button
              onClick={goToCheckout}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPanel = ({ products, setProducts, transactions, trackingInfo, setTrackingInfo }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // In a real application, these notifications would come from a backend
  // For this demo, we'll simulate receiving notifications
  useEffect(() => {
    // Simulate receiving a new notification every 30-60 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of receiving a notification
        const newNotification = {
          id: Date.now(),
          orderId: Math.floor(100000 + Math.random() * 900000),
          customer: ['Ahmad Raza', 'Fatima Khan', 'Usman Ali', 'Ayesha Siddiqui'][Math.floor(Math.random() * 4)],
          amount: Math.floor(1000 + Math.random() * 15000),
          paymentMethod: Math.random() > 0.5 ? 'JazzCash' : 'EasyPaisa',
          phoneNumber: `03${Math.floor(10000000 + Math.random() * 90000000)}`,
          timestamp: new Date().toLocaleString(),
          status: Math.random() > 0.3 ? 'Payment Successful' : 'Payment Failed'
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications
      }
    }, 30000 + Math.random() * 30000); // 30-60 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Function to update tracking status for demo purposes
  const updateTrackingStatus = (trackingId) => {
    const tracking = trackingInfo[trackingId];
    if (!tracking) return;

    // Possible tracking statuses
    const statuses = [
      { status: 'Order Placed', location: 'Processing Center', description: 'Your order has been placed and is being processed.' },
      { status: 'Processing', location: 'Warehouse', description: 'Your order is being processed in our warehouse.' },
      { status: 'Shipped', location: 'Distribution Center', description: 'Your order has been shipped and is on its way.' },
      { status: 'In Transit', location: 'Transit Hub', description: 'Your order is in transit to your location.' },
      { status: 'Out for Delivery', location: 'Local Delivery Center', description: 'Your order is out for delivery.' },
      { status: 'Delivered', location: 'Delivered to Customer', description: 'Your order has been successfully delivered.' }
    ];

    // Find current status index
    const currentIndex = statuses.findIndex(s => s.status === tracking.status);
    
    // Move to next status (if not already at final status)
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      const newTracking = {
        ...tracking,
        status: nextStatus.status,
        location: nextStatus.location,
        timestamp: new Date().toISOString(),
        history: [
          ...tracking.history,
          {
            status: nextStatus.status,
            location: nextStatus.location,
            timestamp: new Date().toISOString(),
            description: nextStatus.description
          }
        ]
      };
      
      setTrackingInfo(prev => ({ ...prev, [trackingId]: newTracking }));
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      (transaction.trackingId && transaction.trackingId.toLowerCase().includes(term)) ||
      `${transaction.customer.firstName} ${transaction.customer.lastName}`.toLowerCase().includes(term) ||
      transaction.id.toString().includes(term)
    );
  });

  const categories = ['Electronics', 'Clothing', 'Food', 'Accessories', 'Home'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...productForm, price: parseFloat(productForm.price), stock: parseInt(productForm.stock) }
          : p
      ));
    } else {
      const newProduct = {
        id: Date.now(),
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        rating: 0,
        reviews: 0
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString()
    });
  };

  const handleDelete = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-card">
          <div className="admin-header">
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">Manage your store products and orders</p>
          </div>

          <div className="admin-content">
            <div className="admin-sidebar">
              <nav>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                >
                  <Package className="admin-nav-icon" />
                  Products
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`admin-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                >
                  <CreditCard className="admin-nav-icon" />
                  Payment Notifications
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`admin-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
                >
                  <Package className="admin-nav-icon" />
                  Transaction History
                </button>
              </nav>
            </div>

            <div className="admin-main">
              {activeTab === 'products' && (
                <div>
                  <div className="form-section">
                    <h2 className="form-title">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <form onSubmit={handleSubmit} className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          className="form-select"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                          className="form-textarea"
                          rows="3"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Price (₨)</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Stock</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Image URL</label>
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-actions">
                        <button
                          type="submit"
                          className="submit-btn"
                        >
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                        {editingProduct && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(null);
                              setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
                            }}
                            className="cancel-btn"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="products-list">
                    <h2 className="products-list-title">Products List</h2>
                    <div className="products-list-items">
                      {products.map(product => (
                        <div key={product.id} className="product-item">
                          <img src={product.image} alt={product.name} className="product-item-image" />
                          <div className="product-item-info">
                            <h3 className="product-item-name">{product.name}</h3>
                            <p className="product-item-category">{product.category}</p>
                            <p className="product-item-price">₨{product.price.toLocaleString()}</p>
                            <p className="product-item-stock">Stock: {product.stock}</p>
                          </div>
                          <div className="product-item-actions">
                            <button
                              onClick={() => handleEdit(product)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="form-title">Payment Notifications</h2>
                  <p className="admin-subtitle">Real-time payment notifications from JazzCash and EasyPaisa</p>
                  
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.status.includes('Successful') ? 'success' : 'error'}`}
                        >
                          <div className="notification-header">
                            <h3>Order #{notification.orderId}</h3>
                            <span className={`status-badge ${notification.status.includes('Successful') ? 'success' : 'error'}`}>
                              {notification.status}
                            </span>
                          </div>
                          
                          <div className="notification-details">
                            <p><strong>Customer:</strong> {notification.customer}</p>
                            <p><strong>Amount:</strong> ₨{notification.amount.toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> {notification.paymentMethod}</p>
                            <p><strong>Phone:</strong> {notification.phoneNumber}</p>
                            <p><strong>Timestamp:</strong> {notification.timestamp}</p>
                          </div>
                          
                          <div className="notification-actions">
                            <button className="view-order-btn">View Order</button>
                            <button className="process-btn">Process Payment</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <CreditCard size={48} className="notification-icon" />
                        <p>No payment notifications received yet.</p>
                        <p className="notification-subtext">Notifications will appear here when customers make payments.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  <h2 className="form-title">Transaction History</h2>
                  <p className="admin-subtitle">Complete history of all transactions</p>
                  
                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label">Search by Tracking ID, Customer Name, or Order ID</label>
                      <input
                        type="text"
                        placeholder="Enter tracking ID, customer name, or order ID"
                        className="form-input"
                        id="transaction-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="notifications-list">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(transaction => (
                        <div 
                          key={transaction.id} 
                          className={`notification-item ${transaction.status === 'completed' ? 'success' : 'error'}`}
                        >
                          <div className="notification-header">
                            <h3>Order #{transaction.id}</h3>
                            <span className={`status-badge ${transaction.status === 'completed' ? 'success' : 'error'}`}>
                              {transaction.status === 'completed' ? 'Completed' : 'Failed'}
                            </span>
                          </div>
                          
                          <div className="notification-details">
                            <p><strong>Customer:</strong> {transaction.customer.firstName} {transaction.customer.lastName}</p>
                            <p><strong>Email:</strong> {transaction.customer.email}</p>
                            <p><strong>Phone:</strong> {transaction.customer.phone}</p>
                            <p><strong>Amount:</strong> ₨{transaction.total.toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> {transaction.payment.method}</p>
                            <p><strong>Payment Phone:</strong> {transaction.payment.phoneNumber}</p>
                            <p><strong>Shipping Address:</strong> {transaction.shipping.address}, {transaction.shipping.city}, {transaction.shipping.postalCode}</p>
                            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
                            {transaction.trackingId && (
                              <p>
                                <strong>Tracking ID:</strong> 
                                <span style={{fontWeight: 'bold', color: '#8a2be2', marginLeft: '5px'}}>
                                  {transaction.trackingId}
                                </span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(transaction.trackingId);
                                    alert('Tracking ID copied to clipboard!');
                                  }}
                                  style={{
                                    marginLeft: '10px',
                                    padding: '2px 8px',
                                    fontSize: '0.8rem',
                                    backgroundColor: '#8a2be2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Copy
                                </button>
                              </p>
                            )}
                            {transaction.trackingId && trackingInfo[transaction.trackingId] && (
                              <p><strong>Tracking Status:</strong> {trackingInfo[transaction.trackingId].status}</p>
                            )}
                          </div>
                          
                          <div className="notification-actions">
                            <button className="view-order-btn">View Details</button>
                            {transaction.status === 'completed' && transaction.trackingId && (
                              <button 
                                className="process-btn"
                                onClick={() => {
                                  updateTrackingStatus(transaction.trackingId);
                                  alert(`Tracking status updated for ${transaction.trackingId}!`);
                                }}
                              >
                                Update Tracking
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <Package size={48} className="notification-icon" />
                        <p>No transactions found.</p>
                        <p className="notification-subtext">Try a different search term or transaction history will appear here when customers complete purchases.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = ({ onBack, onOrderComplete }) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    shipping: {
      address: '',
      city: '',
      postalCode: '',
      country: 'Pakistan'
    },
    payment: {
      method: '',
      phoneNumber: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePayment = async () => {
    // Move to payment processing step
    setCurrentStep(4);
  };

  const completePayment = async () => {
    // Show verification step
    setCurrentStep(5);
  };

  const verifyPayment = async () => {
    // Simulate payment verification delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate payment verification (70% success rate)
    const success = Math.random() > 0.3;
    
    // Create admin notification
    const adminNotification = {
      id: Date.now(),
      orderId: Date.now(),
      customer: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      amount: getTotalPrice(),
      paymentMethod: orderData.payment.method,
      phoneNumber: orderData.payment.phoneNumber,
      timestamp: new Date().toLocaleString(),
      status: success ? 'Payment Successful' : 'Payment Failed'
    };
    
    // Log notification to console (in a real app, this would be sent to a backend)
    console.log('Admin Notification:', adminNotification);
    
    // Create order object
    const order = {
      id: Date.now(),
      items: cart,
      total: getTotalPrice(),
      customer: orderData.customer,
      shipping: orderData.shipping,
      payment: orderData.payment,
      status: success ? 'completed' : 'failed',
      date: new Date().toISOString(),
      trackingId: success ? `TRK${Math.floor(100000 + Math.random() * 900000)}` : null
    };

    if (success) {
      clearCart();
    }
    
    onOrderComplete(order, success);
  };

  const steps = [
    { number: 1, title: 'Customer Info' },
    { number: 2, title: 'Shipping' },
    { number: 3, title: 'Payment Method' },
    { number: 4, title: 'Complete Payment' },
    { number: 5, title: 'Verification' }
  ];

  // Payment instructions based on selected method
  const getPaymentInstructions = () => {
    if (orderData.payment.method === 'jazzcash') {
      return {
        title: 'JazzCash Payment',
        steps: [
          'You will receive a JazzCash request on your phone',
          'Open your JazzCash app',
          'Verify the payment amount',
          'Enter your JazzCash PIN',
          'Complete the transaction'
        ],
        icon: <CreditCard />
      };
    } else if (orderData.payment.method === 'easypaisa') {
      return {
        title: 'EasyPaisa Payment',
        steps: [
          'You will receive an EasyPaisa request on your phone',
          'Open your EasyPaisa app',
          'Verify the payment amount',
          'Enter your EasyPaisa PIN',
          'Complete the transaction'
        ],
        icon: <Phone />
      };
    }
    return null;
  };

  const paymentInstructions = getPaymentInstructions();

  return (
    <div className="product-detail checkout-page">
      <div className="product-detail-container">
        <button
          onClick={onBack}
          className="back-btn"
        >
          <ArrowLeft className="mr-2" />
          Back to Cart
        </button>

        <div className="checkout-grid">
          {/* Checkout Form */}
          <div className="checkout-form">
            <div className="product-detail-card">
              <h1 className="form-title">Checkout</h1>
              
              {/* Steps */}
              <div className="checkout-steps">
                {steps.map((step, index) => (
                  <div key={step.number} className="step-item">
                    <div className={`step-number ${currentStep >= step.number ? 'active' : ''}`}>
                      {currentStep > step.number ? <Check /> : step.number}
                    </div>
                    <span className={`step-title ${currentStep >= step.number ? 'active' : ''}`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`step-line ${currentStep > step.number ? 'active' : ''}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Customer Info */}
              {currentStep === 1 && (
                <div className="form-section">
                  <h2 className="section-title">Customer Information</h2>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        value={orderData.customer.firstName}
                        onChange={(e) => handleInputChange('customer', 'firstName', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        value={orderData.customer.lastName}
                        onChange={(e) => handleInputChange('customer', 'lastName', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={orderData.customer.email}
                        onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        value={orderData.customer.phone}
                        onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <div className="form-section">
                  <h2 className="section-title">Shipping Address</h2>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      value={orderData.shipping.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        value={orderData.shipping.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        value={orderData.shipping.postalCode}
                        onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="form-section">
                  <h2 className="section-title">Payment Method</h2>
                  <div className="payment-methods">
                    <div
                      onClick={() => handleInputChange('payment', 'method', 'jazzcash')}
                      className={`payment-method ${orderData.payment.method === 'jazzcash' ? 'selected' : ''}`}
                    >
                      <div className="payment-icon">
                        <CreditCard />
                      </div>
                      <h3 className="payment-title">JazzCash</h3>
                      <p className="payment-desc">Pay with your JazzCash wallet</p>
                    </div>
                    
                    <div
                      onClick={() => handleInputChange('payment', 'method', 'easypaisa')}
                      className={`payment-method ${orderData.payment.method === 'easypaisa' ? 'selected' : ''}`}
                    >
                      <div className="payment-icon">
                        <Phone />
                      </div>
                      <h3 className="payment-title">EasyPaisa</h3>
                      <p className="payment-desc">Pay with your EasyPaisa account</p>
                    </div>
                  </div>

                  {orderData.payment.method && (
                    <div className="form-group">
                      <label className="form-label">
                        {orderData.payment.method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Phone Number
                      </label>
                      <input
                        type="tel"
                        value={orderData.payment.phoneNumber}
                        onChange={(e) => handleInputChange('payment', 'phoneNumber', e.target.value)}
                        placeholder="03XX-XXXXXXX"
                        className="form-input"
                        required
                      />
                      <p className="form-help-text">
                        Enter the phone number linked to your {orderData.payment.method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} account
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Payment Processing */}
              {currentStep === 4 && (
                <div className="form-section">
                  <h2 className="section-title">Complete Your Payment</h2>
                  
                  {paymentInstructions ? (
                    <div className="payment-instructions">
                      <div className="payment-header">
                        <div className="payment-icon-large">
                          {paymentInstructions.icon}
                        </div>
                        <h3>{paymentInstructions.title}</h3>
                        <p className="payment-amount">₨{getTotalPrice().toLocaleString()}</p>
                      </div>
                      
                      <div className="payment-steps">
                        <h4>Payment Instructions:</h4>
                        <ol>
                          {paymentInstructions.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="payment-warning">
                        <p><strong>Note:</strong> Do not close this window until payment is complete.</p>
                      </div>
                      
                      <div className="form-actions">
                        <button
                          onClick={completePayment}
                          className="submit-btn"
                        >
                          I've Completed the Payment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p>Please select a payment method first.</p>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="submit-btn"
                      >
                        Back to Payment Methods
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Payment Verification */}
              {currentStep === 5 && (
                <div className="form-section text-center">
                  <h2 className="section-title">Verifying Your Payment</h2>
                  <div className="processing-animation">
                    <div className="spinner"></div>
                    <p className="processing-text">Verifying payment with {orderData.payment.method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}...</p>
                    <p className="processing-subtext">Please do not refresh or close the page</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-actions">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1 || currentStep === 5}
                  className={`cancel-btn ${currentStep === 1 || currentStep === 5 ? 'disabled' : ''}`}
                >
                  Previous
                </button>
                
                {currentStep < 3 && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="submit-btn"
                  >
                    Next
                  </button>
                )}
                
                {currentStep === 3 && orderData.payment.method && orderData.payment.phoneNumber && (
                  <button
                    onClick={handlePayment}
                    className="submit-btn"
                  >
                    Proceed to Payment
                  </button>
                )}
                
                {currentStep === 5 && (
                  <button
                    onClick={verifyPayment}
                    className="submit-btn"
                  >
                    Verify Payment
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="product-detail-card sticky">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} className="summary-item-image" />
                    <div className="summary-item-info">
                      <h3 className="summary-item-name">{item.name}</h3>
                      <p className="summary-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="summary-item-price">
                      ₨{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="summary-total">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₨{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₨{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderResult = ({ order, success, onContinueShopping, onTrackOrder }) => {
  return (
    <div className="product-detail">
      <div className="order-result-container">
        <div className="product-detail-card order-result-card">
          <div className={`order-result-icon ${success ? 'success' : 'error'}`}>
            {success ? (
              <Check />
            ) : (
              <X />
            )}
          </div>
          
          <h1 className={`order-result-title ${success ? 'success' : 'error'}`}>
            {success ? 'Order Successful!' : 'Payment Failed'}
          </h1>
          
          <p className="order-result-message">
            {success 
              ? `Your order #${order.id} has been confirmed and will be processed shortly.`
              : 'There was an issue processing your payment. Please try again.'
            }
          </p>
          
          {success && (
            <div className="order-details">
              <h3 className="order-details-title">Order Confirmation:</h3>
              <p className="order-detail"><strong>Order ID:</strong> #{order.id}</p>
              <p className="order-detail"><strong>Total Amount:</strong> ₨{order.total.toLocaleString()}</p>
              <p className="order-detail"><strong>Payment Method:</strong> {order.payment.method}</p>
              <p className="order-detail"><strong>Tracking ID:</strong> {order.trackingId}</p>
              <p className="order-detail"><strong>Status:</strong> <span className="success-text">Payment Confirmed</span></p>
              <p className="order-detail admin-confirmation"><strong>Admin Status:</strong> Order received and being processed</p>
              
              <div className="tracking-link">
                <p><strong>Track your order:</strong></p>
                <button 
                  onClick={onTrackOrder}
                  className="submit-btn"
                  style={{marginTop: '10px'}}
                >
                  Track Order
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={onContinueShopping}
            className="submit-btn order-result-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>LocalStore</h3>
          <p>Your one-stop shop for all your needs. Quality products with fast delivery and excellent customer service.</p>
          <div className="social-links">
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Deals</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="footer-links">
            <li><MapPin /> 123 Shopping Street, Karachi, Pakistan</li>
            <li><Phone /> +92 300 1234567</li>
            <li><Mail /> support@localstore.pk</li>
          </ul>
        </div>
      </div>
      
      <div className="copyright">
        <p>&copy; 2025 LocalStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Notification Component
const Notification = ({ notification, onClose }) => {
  return (
    <div className="notification">
      <div className="notification-content">
        <h4 className="notification-title">Admin Notification</h4>
        <p className="notification-message">
          New order #{notification.orderId} from {notification.customer} for ₨{notification.amount.toLocaleString()} via {notification.paymentMethod}
        </p>
        <div className="notification-footer">
          <span className="notification-status">{notification.status}</span>
          <span className="notification-time">{notification.timestamp}</span>
        </div>
      </div>
      <button onClick={onClose} className="notification-close">
        <X size={16} />
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [lastOrder, setLastOrder] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState({});

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const handleOrderComplete = (order, success) => {
    setLastOrder(order);
    setOrderSuccess(success);
    
    // Add to transaction history
    if (order) {
      setTransactions(prev => [...prev, order]);
      
      // Initialize tracking info for successful orders
      if (success && order.trackingId) {
        const initialTracking = {
          trackingId: order.trackingId,
          status: 'Order Placed',
          location: 'Processing Center',
          timestamp: new Date().toISOString(),
          history: [
            {
              status: 'Order Placed',
              location: 'Processing Center',
              timestamp: new Date().toISOString(),
              description: 'Your order has been placed and is being processed.'
            }
          ]
        };
        setTrackingInfo(prev => ({ ...prev, [order.trackingId]: initialTracking }));
      }
    }
    
    setCurrentPage('order-result');
  };

  // Function to navigate to track order page
  const goToTrackOrder = () => {
    setCurrentPage('track-order');
  };

  // Add notification function
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Remove notification function
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <CartProvider setCurrentPage={setCurrentPage}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <CartSidebar />

        {/* Notifications Container */}
        <div className="notifications-container">
          {notifications.map(notification => (
            <Notification 
              key={notification.id} 
              notification={notification} 
              onClose={() => removeNotification(notification.id)} 
            />
          ))}
        </div>

        {currentPage === 'home' && (
          <main>
            {/* Hero Section */}
            <div className="hero">
              <h1>
                Welcome to <span>LocalStore</span>
              </h1>
              <p>
                Discover amazing products with fast delivery and great prices. Your one-stop shop for everything you need.
              </p>
            </div>

            {/* Filters */}
            <div className="filters">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {sortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleProductClick}
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </main>
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanel products={products} setProducts={setProducts} transactions={transactions} trackingInfo={trackingInfo} setTrackingInfo={setTrackingInfo} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onBack={() => setCurrentPage('home')}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {currentPage === 'order-result' && lastOrder && (
          <OrderResult
            order={lastOrder}
            success={orderSuccess}
            onContinueShopping={() => setCurrentPage('home')}
            onTrackOrder={() => setCurrentPage('track-order')}
          />
        )}
        
        {currentPage === 'track-order' && (
          <TrackOrderPage 
            trackingInfo={trackingInfo}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        <Footer />
      </div>
    </CartProvider>
  );
};

// Track Order Page Component
const TrackOrderPage = ({ trackingInfo, onBack }) => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState(null);

  const handleTrackOrder = () => {
    if (trackingId && trackingInfo[trackingId]) {
      setTrackingData(trackingInfo[trackingId]);
    } else if (trackingId) {
      alert('Tracking ID not found. Please check the ID and try again.');
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button
          onClick={onBack}
          className="back-btn"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </button>

        <div className="product-detail-card">
          <h1 className="form-title">Track Your Order</h1>
          
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Enter Tracking ID</label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID (e.g., TRK123456)"
                className="form-input"
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
            </div>
            <button
              onClick={handleTrackOrder}
              className="submit-btn"
            >
              Track Order
            </button>
          </div>

          {trackingData && (
            <div className="order-details">
              <h3 className="order-details-title">Order Tracking Information</h3>
              <p className="order-detail"><strong>Tracking ID:</strong> {trackingData.trackingId}</p>
              <p className="order-detail"><strong>Current Status:</strong> 
                <span className="success-text"> {trackingData.status}</span>
              </p>
              <p className="order-detail"><strong>Current Location:</strong> {trackingData.location}</p>
              <p className="order-detail"><strong>Last Updated:</strong> {new Date(trackingData.timestamp).toLocaleString()}</p>
              
              <div className="tracking-history">
                <h4>Tracking History:</h4>
                {trackingData.history.map((entry, index) => (
                  <div key={index} className="tracking-entry">
                    <p><strong>{entry.status}</strong> - {new Date(entry.timestamp).toLocaleString()}</p>
                    <p>{entry.location}</p>
                    <p className="text-sm text-gray-600">{entry.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!trackingData && trackingId && (
            <div className="no-notifications">
              <Package size={48} className="notification-icon" />
              <p>Tracking information not found.</p>
              <p className="notification-subtext">Please check your tracking ID and try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;