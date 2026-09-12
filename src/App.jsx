import React, { useState, useMemo } from 'react';
import { mockProducts } from './data/mockProducts';

// Components
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterSidebar from './components/FilterSidebar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import StoreLocationSection from './components/StoreLocationSection';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import CheckoutModal from './components/CheckoutModal.jsx';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  const GOOGLE_MAPS_URL = "https://www.google.com/maps?daddr=Booth+No.+13,+Sub.+City+Center,+35C,+Sector+35,+Chandigarh,+160022";
  const categories = ['All', 'Clinical Skincare', 'Baby Care', 'Nutrition & Wellness', 'Personal Care', 'Hair & Scalp'];
  const brands = ['All', 'Cetaphil', 'Dot & Key', 'The Derma Co', 'Sebamed', 'Himalaya', 'Johnson\'s Baby', 'Ensure', 'HK Vitals'];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedBrand, maxPrice]);

  // Cart Handlers
  const addToCart = (product, e, quantity = 1) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBuyNow = (product, quantity) => {
    addToCart(product, null, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1a2e26] font-sans antialiased selection:bg-[#476556] selection:text-white pb-16">
      <AnnouncementBar mapsUrl={GOOGLE_MAPS_URL} />
      
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mapsUrl={GOOGLE_MAPS_URL}
        totalCartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Hero mapsUrl={GOOGLE_MAPS_URL} />

      {/* Main Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-[#071610] text-white shadow-sm' : 'bg-white border border-[#d6d2c4] text-gray-700 hover:bg-[#f2efe6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FilterSidebar
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
          />

          <section className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Showing {filteredProducts.length} verified products
              </span>
              {(selectedCategory !== 'All' || selectedBrand !== 'All' || searchQuery) && (
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedBrand('All'); setSearchQuery(''); setMaxPrice(2500); }}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e5e2d9] p-12 text-center">
                <p className="text-sm font-semibold text-gray-700">No products found matching your filter.</p>
                <p className="text-xs text-gray-500 mt-1">Try resetting the search or brand filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => { setSelectedProduct(p); setModalQty(1); }}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <StoreLocationSection mapsUrl={GOOGLE_MAPS_URL} />
      <ReviewsSection />
      <Footer mapsUrl={GOOGLE_MAPS_URL} />

      {/* Overlays & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onProceedToCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />

      <ProductModal
        product={selectedProduct}
        quantity={modalQty}
        setQuantity={setModalQty}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, e, q) => { addToCart(p, e, q); setSelectedProduct(null); }}
        onBuyNow={handleBuyNow}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={() => { setCart([]); setIsCheckoutOpen(false); }}
      />

      <FloatingContact />
    </div>
  );
}
