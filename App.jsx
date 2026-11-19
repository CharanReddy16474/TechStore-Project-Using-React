import ProductCard from "./component/ProductCard";
import "./App.css";
import data from "./component/data.js";
import { useState, useEffect } from "react";


function App() {

  const allBrands = [...new Set(data.map((p) => p.brand))];

  const [cartItems, setCartItems] = useState(()=>{
    const savedCart=localStorage.getItem("techstore-cart");
    if(savedCart){
      return JSON.parse(savedCart);
    }
    return [];
  });

useEffect(()=>{
  
  localStorage.setItem("techstore-cart",JSON.stringify(cartItems));

},[cartItems])


  const [wishlist, setWishlist] = useState(()=>{
    const savedWishlist=localStorage.getItem("techstore-wishlist");
    if(savedWishlist){
      return JSON.parse(savedWishlist);
    }
    return[];
  });

  useEffect(()=>{
    localStorage.setItem("techstore-wishlist",JSON.stringify(wishlist));
  },[wishlist])
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("All");
  const [theme, setTheme] = useState("dark");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Apply theme to the document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  function toggleCart() {
    setCartOpen(!cartOpen);
    setWishlistOpen(false);
  }

  function toggleWishlistDrawer() {
    setWishlistOpen(!wishlistOpen);
    setCartOpen(false);
  }

  function closeDrawers() {
    setCartOpen(false);
    setWishlistOpen(false);
  }

  function addToCart(product) {
    const existingProduct = cartItems.find(item => item.id === product.id)

    if (existingProduct) {
      setCartItems(
        cartItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 }
          : item)
      );
    }
    else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  function removeFromCart(productId) {
    setCartItems(cartItems.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(
      cartItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  function toggleWishlist(product) {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id))
    }
    else {
      setWishlist([...wishlist, product])
    }
  }

  function removeFromWishlist(productId) {
    setWishlist(wishlist.filter(item => item.id !== productId));
  }

  // Filter by search term (matches product name or brand)
  let filteredProducts = data.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // Sort products
  if (sortBy === "priceLow") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo" onClick={(e) => e.preventDefault()}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHXPeVkzwQe-5gvHEKqBuvdudm2aNWP7j9ItoSg7GOw&s=10"
              alt="TechStore Logo"
              className="logo-img"
            />
            TechStore
          </a>

          <ul className="nav-links">
            <li>
              <a href="#products" className="nav-link">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Deals
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                About
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            {/* Professional Theme Switch (Sun for Light, Moon for Dark) */}
            <button
              className={`theme-switch ${theme}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={theme === "dark" ? "Dark Mode active. Click for Light Mode." : "Light Mode active. Click for Dark Mode."}
            >
              <span className="theme-switch-track">
                <span className="theme-switch-icon sun" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </span>
                <span className="theme-switch-icon moon" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </span>
                <span className="theme-switch-thumb">
                  {theme === "dark" ? (
                    <svg key="moon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="thumb-icon">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  ) : (
                    <svg key="sun" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="thumb-icon">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  )}
                </span>
              </span>
            </button>

            <button className="nav-btn">Sign In</button>
            <button className="nav-btn primary">Shop Now</button>
            <button className={`nav-btn wishlist-btn ${wishlistOpen ? "active" : ""}`} onClick={toggleWishlistDrawer}>
              ❤️
              {wishlist.length > 0 && <span className="wishlist-badge">{wishlist.length}</span>}
            </button>
            <button className={`nav-btn cart-btn ${cartOpen ? "active" : ""}`} onClick={toggleCart}>
              🛍️
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ============ OVERLAY ============ */}
      {(cartOpen || wishlistOpen) && (
        <div className="drawer-overlay" onClick={closeDrawers}></div>
      )}

      {/* ============ CART DRAWER ============ */}
      <div className={`drawer ${cartOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">🛍️ Your Cart</h2>
          <span className="drawer-count">{cartCount} {cartCount === 1 ? "item" : "items"}</span>
          <button className="drawer-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="drawer-empty">
            <span className="drawer-empty-icon">🛍️</span>
            <p>Your cart is empty</p>
            <span className="drawer-empty-hint">Add products to get started</span>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {cartItems.map((item) => (
                <div className="drawer-item" key={item.id}>
                  <div className="drawer-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="drawer-item-info">
                    <h4 className="drawer-item-name">{item.name}</h4>
                    <p className="drawer-item-brand">{item.brand}</p>
                    <div className="drawer-item-unit-price">₹ {item.price.toLocaleString()} each</div>
                    <div className="drawer-item-bottom">
                      <div className="quantity-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="drawer-item-price-wrapper">
                        <span className="drawer-item-price-sublabel">Subtotal:</span>
                        <span className="drawer-item-price">₹ {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button className="drawer-item-remove" title="Remove item" onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <div className="drawer-summary-card">
                <div className="drawer-summary-row">
                  <span>Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})</span>
                  <span className="drawer-amount">₹ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="drawer-summary-row">
                  <span>Delivery Charges</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="drawer-divider"></div>
                <div className="drawer-summary-row drawer-total">
                  <div>
                    <span className="total-title">Total Amount</span>
                    <span className="total-tax-note">Inclusive of all taxes</span>
                  </div>
                  <span className="total-price-highlight">₹ {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <button className="checkout-btn">Proceed to Checkout • ₹ {cartTotal.toLocaleString()}</button>
            </div>
          </>
        )}
      </div>

      {/* ============ WISHLIST DRAWER ============ */}
      <div className={`drawer ${wishlistOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">❤️ Wishlist</h2>
          <span className="drawer-count">{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</span>
          <button className="drawer-close" onClick={() => setWishlistOpen(false)}>✕</button>
        </div>

        {wishlist.length === 0 ? (
          <div className="drawer-empty">
            <span className="drawer-empty-icon">❤️</span>
            <p>Your wishlist is empty</p>
            <span className="drawer-empty-hint">Double-click any product to save it here</span>
          </div>
        ) : (
          <div className="drawer-items">
            {wishlist.map((item) => (
              <div className="drawer-item" key={item.id}>
                <div className="drawer-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="drawer-item-info">
                  <h4 className="drawer-item-name">{item.name}</h4>
                  <p className="drawer-item-brand">{item.brand}</p>
                  <div className="drawer-item-bottom">
                    <div className="wishlist-price-block">
                      <span className="drawer-item-price">₹ {item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="wishlist-original-price">₹ {item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    {item.discount && <span className="drawer-item-discount">{item.discount}</span>}
                  </div>
                  <button className="drawer-add-cart" onClick={() => addToCart(item)}>🛍️ Add to Cart</button>
                </div>
                <button className="drawer-item-remove" title="Remove from wishlist" onClick={() => removeFromWishlist(item.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ MAIN CONTENT ============ */}
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">New Arrivals 2025</p>
          <h1 className="hero-title">
            The Future of Tech
            <br />
            <span className="hero-highlight">Is Here.</span>
          </h1>
          <p className="hero-description">
            Discover the latest in premium technology. From powerful computers
            to cutting-edge smartphones, find everything you need in one place.
          </p>
          <div className="hero-cta">
            <button className="btn-primary">Explore Products</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat">
            <span className="stat-number">200+</span>
            <span className="stat-label">Premium Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Customer Support</span>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">
            Our most popular products loved by customers
          </p>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Brands</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="All">Sort By</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                rating={product.rating}
                image={product.image}
                isBestSeller={product.isBestSeller}
                isWishlisted={wishlist.some(item => item.id === product.id)}
                onAddToCart={() => addToCart(product)}
                onToggleWishlist={() => toggleWishlist(product)}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 TechStore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
