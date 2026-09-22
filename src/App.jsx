// src/App.jsx
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "./lib/supabase";
import { ArrowUpDown, X, Sparkles } from "lucide-react";

// Public Store Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import PrescriptionModal from "./components/PrescriptionModal";
import ReviewsSection from "./components/ReviewsSection";
import StoreLocationSection from "./components/StoreLocationSection";
import Footer from "./components/Footer";
import PolicyModal from "./components/PolicyModal";

// Dedicated Standalone Admin Portal
import AdminOrdersPortal from "./components/AdminOrdersPortal";

// Standard Pharmacy Core Departments
const CORE_CATEGORIES = [
  "All",
  "Clinical Skincare",
  "Baby Care",
  "Daily Wellness",
  "Hair Care",
  "Prescription & OTC",
];

export default function App() {
  // Check Admin Portal Route (?admin=true or /admin)
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return (
      window.location.pathname.toLowerCase().includes("/admin") ||
      new URLSearchParams(window.location.search).get("admin") === "true"
    );
  });

  // Public Catalog & State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState("All"); // 'All' | 'under300' | '300to600' | 'above600'
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'lowToHigh' | 'highToLow'

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("getwell_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [policyModal, setPolicyModal] = useState({
    isOpen: false,
    tab: "terms",
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("getwell_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Cart save error:", err);
    }
  }, [cart]);

  // Fetch Catalog from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Catalog fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminRoute) {
      fetchProducts();
    }
  }, [isAdminRoute]);

  // ================= DYNAMIC FILTERS CALCULATION =================
  // Merge core departments with any custom categories from Supabase
  const categories = useMemo(() => {
    const dbCats = products.map((p) => p.category || p.concern).filter(Boolean);
    return [...new Set([...CORE_CATEGORIES, ...dbCats])];
  }, [products]);

  // Extract all brands dynamically from uploaded products
  const brands = useMemo(() => {
    const b = products.map((p) => p.brand || p.brand_name).filter(Boolean);
    return ["All", ...new Set(b)];
  }, [products]);

  // Check if any filter is active
  const isFiltered =
    selectedCategory !== "All" ||
    selectedBrand !== "All" ||
    priceRange !== "All" ||
    searchQuery.trim() !== "" ||
    sortBy !== "featured";

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setPriceRange("All");
    setSortBy("featured");
    setSearchQuery("");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Category Filter
        const productCat = p.category || p.concern || "";
        const matchesCat =
          selectedCategory === "All" || productCat === selectedCategory;

        // 2. Brand Filter
        const productBrand = p.brand || p.brand_name || "";
        const matchesBrand =
          selectedBrand === "All" || productBrand === selectedBrand;

        // 3. Search Query Filter
        const nameStr = p.name || p.title || "";
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          nameStr.toLowerCase().includes(q) ||
          productBrand.toLowerCase().includes(q) ||
          productCat.toLowerCase().includes(q);

        // 4. Price Range Filter
        const price = Number(p.price) || 0;
        let matchesPrice = true;
        if (priceRange === "under300") matchesPrice = price < 300;
        else if (priceRange === "300to600")
          matchesPrice = price >= 300 && price <= 600;
        else if (priceRange === "above600") matchesPrice = price > 600;

        return matchesCat && matchesBrand && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        // 5. Price Sorting
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        if (sortBy === "lowToHigh") return priceA - priceB;
        if (sortBy === "highToLow") return priceB - priceA;
        return 0; // Default featured
      });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    searchQuery,
    priceRange,
    sortBy,
  ]);

  // ================= ADMIN ROUTE =================
  if (isAdminRoute) {
    return (
      <AdminOrdersPortal
        onExitToStore={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // ================= PUBLIC CUSTOMER VIEW =================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        cartCount={cart.reduce(
          (acc, item) => acc + (Number(item?.quantity) || 1),
          0,
        )}
        products={products}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onViewProduct={(p) => setSelectedProduct(p)}
        onAddToCart={handleAddToCart}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Sleek Hero Banner */}
        <Hero onOpenPrescription={() => setIsPrescriptionOpen(true)} />

        {/* Catalog & Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Section Header & Segmented Category Track */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Sector 35C Counter Stock
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Verified Pharmacy Catalog
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Showing{" "}
                <strong className="text-slate-800 font-semibold">
                  {filteredProducts.length}
                </strong>{" "}
                {filteredProducts.length === 1 ? "item" : "items"} ready for
                immediate dispatch
              </p>
            </div>

            {/* Apple-style Segmented Category Track */}
            <div className="bg-slate-200/60 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none border border-slate-200/80 shadow-inner">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20 scale-[1.02]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified Filter Toolbar */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Dropdowns Group */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto">
                {/* 1. Brand Filter */}
                <div className="relative flex-1 sm:flex-initial">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                      selectedBrand !== "All"
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="text-[11px] text-slate-400 font-medium">
                      Brand:
                    </span>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="bg-transparent font-bold focus:outline-none cursor-pointer pr-2 truncate max-w-[130px] sm:max-w-[160px]"
                    >
                      <option value="All">
                        All Brands ({brands.length - 1})
                      </option>
                      {brands
                        .filter((b) => b !== "All")
                        .map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* 2. Price Range Filter */}
                <div className="relative flex-1 sm:flex-initial">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                      priceRange !== "All"
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="text-[11px] text-slate-400 font-medium">
                      Price:
                    </span>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="bg-transparent font-bold focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="All">All Budgets</option>
                      <option value="under300">Under ₹300</option>
                      <option value="300to600">₹300 – ₹600</option>
                      <option value="above600">Above ₹600</option>
                    </select>
                  </div>
                </div>

                {/* 3. Sort By Dropdown */}
                <div className="relative flex-1 sm:flex-initial">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                      sortBy !== "featured"
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-400 font-medium">
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent font-bold focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="featured">Featured Stock</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reset Filters Pill */}
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                >
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse space-y-3"
                >
                  <div className="h-44 bg-slate-200 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 my-6 shadow-xs space-y-3">
              <p className="text-lg font-bold text-slate-800">
                No medicines match your filter selection
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing active filters or inquire directly on WhatsApp for
                unlisted counter stock.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setIsPrescriptionOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Order via WhatsApp Rx
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Carousel */}
        <ReviewsSection />

        {/* Counter Location & Hours */}
        <StoreLocationSection />
      </main>

      {/* Customer Footer */}
      <Footer onOpenPolicy={(tab) => setPolicyModal({ isOpen: true, tab })} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onClearCart={() => {
          setCart([]);
          localStorage.removeItem("getwell_cart");
        }}
      />

      {/* Product Magnifier / Lightbox Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={(prod) => {
          handleAddToCart(prod);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Prescription Upload Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
      />

      {/* Legal Policies Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        onClose={() => setPolicyModal((prev) => ({ ...prev, isOpen: false }))}
        initialTab={policyModal.tab}
      />
    </div>
  );
}
