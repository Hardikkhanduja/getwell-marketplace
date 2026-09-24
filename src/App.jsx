// src/App.jsx
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "./lib/supabase";
import { ArrowUpDown, X, ShoppingBag } from "lucide-react";

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
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

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

  // Total Cart Items Count
  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + (Number(item?.quantity) || 1), 0);
  }, [cart]);

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
        .order("id", { ascending: false });

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

  // Dynamic Filters
  const categories = useMemo(() => {
    const dbCats = products.map((p) => p.category || p.concern).filter(Boolean);
    return [...new Set([...CORE_CATEGORIES, ...dbCats])];
  }, [products]);

  const brands = useMemo(() => {
    const b = products.map((p) => p.brand || p.brand_name).filter(Boolean);
    return ["All", ...new Set(b)];
  }, [products]);

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

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const productCat = p.category || p.concern || "";
        const matchesCat =
          selectedCategory === "All" || productCat === selectedCategory;

        const productBrand = p.brand || p.brand_name || "";
        const matchesBrand =
          selectedBrand === "All" || productBrand === selectedBrand;

        const nameStr = p.name || p.title || "";
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          nameStr.toLowerCase().includes(q) ||
          productBrand.toLowerCase().includes(q) ||
          productCat.toLowerCase().includes(q);

        const price = Number(p.price || p.selling_price) || 0;
        let matchesPrice = true;
        if (priceRange === "under300") matchesPrice = price < 300;
        else if (priceRange === "300to600")
          matchesPrice = price >= 300 && price <= 600;
        else if (priceRange === "above600") matchesPrice = price > 600;

        return matchesCat && matchesBrand && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = Number(a.price || a.selling_price) || 0;
        const priceB = Number(b.price || b.selling_price) || 0;
        if (sortBy === "lowToHigh") return priceA - priceB;
        if (sortBy === "highToLow") return priceB - priceA;
        return 0;
      });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    searchQuery,
    priceRange,
    sortBy,
  ]);

  if (isAdminRoute) {
    return (
      <AdminOrdersPortal
        onExitToStore={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  // Bulletproof Add to Cart Handler
  const handleAddToCart = (product, quantity = 1) => {
    if (!product) return;
    const qtyToAdd = Number(quantity) || 1;
    const prodId = product.id;

    // Normalized item for both CartDrawer and CheckoutModal
    const formattedItem = {
      ...product,
      id: prodId,
      name: product.name || product.title || "Medicine Item",
      title: product.name || product.title || "Medicine Item",
      price: Number(product.price || product.selling_price) || 0,
      selling_price: Number(product.price || product.selling_price) || 0,
      mrp: Number(product.mrp || product.price) || 0,
      image_url:
        Array.isArray(product.image_urls) && product.image_urls.length > 0
          ? product.image_urls[0]
          : product.image_url || product.image || "/placeholder-med.png",
      image:
        Array.isArray(product.image_urls) && product.image_urls.length > 0
          ? product.image_urls[0]
          : product.image_url || product.image || "/placeholder-med.png",
      brand: product.brand || product.brand_name || "Pharma",
      brand_name: product.brand || product.brand_name || "Pharma",
      unit: product.unit || product.size_volume || "",
      size_volume: product.unit || product.size_volume || "",
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(item.id) === String(prodId),
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (Number(updated[existingIndex].quantity) || 1) + qtyToAdd,
        };
        return updated;
      }
      return [...prev, { ...formattedItem, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((prev) =>
        prev.filter((item) => String(item.id) !== String(productId)),
      );
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) =>
      prev.filter((item) => String(item.id) !== String(productId)),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Header Bar with Floating Glass Pill */}
      <Header
        cartCount={totalCartCount}
        products={products}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onViewProduct={(p) => setSelectedProduct(p)}
        onAddToCart={handleAddToCart}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Main Storefront Area */}
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Hero Showcase */}
        <Hero
          onOpenPrescription={() => setIsPrescriptionOpen(true)}
          onExploreCatalog={() => {
            const el = document.getElementById("catalog-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Catalog & Filter Section */}
        <section
          id="catalog-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Direct Pharmacy Counter
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Authentic Medicines & Skincare
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Fresh batches sourced directly from licensed pharma distributors
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="featured">Featured / Newest</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Quick Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Filter Badges */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400">
                Active Filters:
              </span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="hover:text-emerald-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand !== "All" && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Brand: {selectedBrand}
                  <button
                    onClick={() => setSelectedBrand("All")}
                    className="hover:text-emerald-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-emerald-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline ml-auto cursor-pointer"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3"
                >
                  <div className="w-full aspect-square bg-slate-100 rounded-xl"></div>
                  <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                  <div className="h-8 bg-slate-100 rounded-xl w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-2xs max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                💊
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-4">
                No matching medicines found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                We might have it on physical store counters at Sector 35C. Send
                us a WhatsApp photo of your prescription.
              </p>
              <button
                type="button"
                onClick={() => setIsPrescriptionOpen(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Upload Prescription on WhatsApp
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product, 1)}
                  onViewProduct={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Google Reviews */}
        <ReviewsSection />

        {/* Verified Google Maps Store Location */}
        <StoreLocationSection />
      </main>

      {/* 3. Official Store Footer */}
      <Footer onOpenPolicy={(tab) => setPolicyModal({ isOpen: true, tab })} />

      {/* 4. Left Floating Button: WhatsApp Direct */}
      <aside
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-50"
      >
        <a
          href="https://wa.me/919872633001?text=Hi%20Getwell%20Medicos,%20I%20want%20to%20inquire%20about%20medicine%20availability%20or%20place%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-emerald-950/25 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Chat with Getwell Medicos Pharmacist on WhatsApp"
        >
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.952 3.71 1.453 5.711 1.454h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </aside>

      {/* 5. Right Floating Button: Shopping Cart */}
      <aside
        aria-label="Open Shopping Bag"
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl shadow-slate-950/25 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer relative"
          title="Open Shopping Bag"
        >
          <ShoppingBag className="w-6 h-6 text-white" />

          {/* Floating Live Badge */}
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-mono font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-in zoom-in-75 duration-150">
              {totalCartCount}
            </span>
          )}
        </button>
      </aside>

      {/* 6. Modals & Drawers with Full Dual Prop Compatibility */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        cartItems={cart}
        onOrderPlaced={() => setCart([])}
      />

      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <PolicyModal
        isOpen={policyModal.isOpen}
        defaultTab={policyModal.tab}
        onClose={() => setPolicyModal({ isOpen: false, tab: "terms" })}
      />
    </div>
  );
}
