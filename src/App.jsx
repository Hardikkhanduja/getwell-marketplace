import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "./lib/supabase";
import mockProducts from "./data/mockProducts";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FilterSidebar from "./components/FilterSidebar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import StoreLocationSection from "./components/StoreLocationSection";
import ReviewsSection from "./components/ReviewsSection";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
import PrescriptionModal from "./components/PrescriptionModal";
import AdminOrdersPortal from "./components/AdminOrdersPortal";

// Helper to normalize Supabase row into standard app product object
function normalizeProduct(p) {
  const images =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : p.image_url
        ? [p.image_url]
        : ["/Cetaphil-Gentle.png"];

  return {
    id: p.id,
    name: p.title || p.name || "Getwell Product",
    subtitle: p.subtitle || "",
    brand: p.brand_name || p.brand || "Getwell Verified",
    category: p.concern || p.category || "Clinical Skincare",
    price: Number(p.price) || 0,
    originalPrice:
      Number(p.mrp) || Number(p.originalPrice) || Number(p.price) || 0,
    sizeVolume: p.size_volume || "",
    rating: Number(p.rating) || 4.9,
    reviewsCount: Number(p.reviews_count) || 120,
    images: images,
    image: images[0],
    benefits: Array.isArray(p.benefits) ? p.benefits : [],
    keyIngredients: Array.isArray(p.key_ingredients) ? p.key_ingredients : [],
    expiryDate: p.expiry_date || "",
    inStock: p.in_stock !== false,
    isBestseller: Boolean(p.is_bestseller),
    description:
      p.subtitle ||
      (Array.isArray(p.benefits) && p.benefits.length > 0
        ? p.benefits.join(". ")
        : p.description ||
          "Authentic clinical product directly sourced from authorized pharmaceutical distributors."),
  };
}

export default function App() {
  const [products, setProducts] = useState(mockProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  const GOOGLE_MAPS_URL =
    "https://www.google.com/maps?daddr=Booth+No.+13,+Sub.+City+Center,+35C,+Sector+35,+Chandigarh,+160022";

  // Check if URL has ?admin=true or ?manage=true on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || params.get("manage") === "true") {
      setIsAdminOpen(true);
    }
  }, []);

  // Fetch live products from Supabase
  useEffect(() => {
    async function loadSupabaseProducts() {
      if (!supabase) {
        setLoadingProducts(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn(
            "Supabase fetch error, falling back to mock catalog:",
            error,
          );
        } else if (data && data.length > 0) {
          const formatted = data.map(normalizeProduct);
          setProducts(formatted);
        }
      } catch (err) {
        console.error("Error querying Supabase:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadSupabaseProducts();
  }, []);

  // Compute dynamic categories and brands from current products
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.subtitle && product.subtitle.toLowerCase().includes(q));
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesBrand =
        selectedBrand === "All" || product.brand === selectedBrand;
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, maxPrice]);

  // Cart Handlers
  const addToCart = (product, e, quantity = 1) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
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

  // Admin Callbacks
  const handleProductSaved = (newOrUpdated) => {
    const norm = normalizeProduct(newOrUpdated);
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === norm.id);
      return exists
        ? prev.map((p) => (p.id === norm.id ? norm : p))
        : [norm, ...prev];
    });
  };

  const handleProductDeleted = (deletedId) => {
    setProducts((prev) => prev.filter((p) => p.id !== deletedId));
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
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      <Hero
        mapsUrl={GOOGLE_MAPS_URL}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      {/* Main Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#071610] text-white shadow-sm"
                  : "bg-white border border-[#d6d2c4] text-gray-700 hover:bg-[#f2efe6]"
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
                Showing {filteredProducts.length} verified products{" "}
                {loadingProducts && "(Syncing...)"}
              </span>
              {(selectedCategory !== "All" ||
                selectedBrand !== "All" ||
                searchQuery ||
                maxPrice < 2500) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrand("All");
                    setSearchQuery("");
                    setMaxPrice(2500);
                  }}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#e5e2d9] p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Couldn't find "{searchQuery}" in our online catalog?
                  </p>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                    We stock thousands of allopathic medicines &amp; health
                    products at our Sector 35C counter.
                  </p>
                </div>
                <button
                  onClick={() => setIsPrescriptionOpen(true)}
                  className="bg-[#071610] hover:bg-[#1a382b] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Request "{searchQuery}" on WhatsApp Rx</span>
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => {
                      setSelectedProduct(p);
                      setModalQty(1);
                    }}
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
      <Footer
        mapsUrl={GOOGLE_MAPS_URL}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Overlays & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <ProductModal
        product={selectedProduct}
        quantity={modalQty}
        setQuantity={setModalQty}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, e, q) => {
          addToCart(p, e, q);
          setSelectedProduct(null);
        }}
        onBuyNow={handleBuyNow}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onClearCart={() => setCart([])}
      />

      {/* Prescription / Unlisted Medicine Inquiry Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
      />

      {/* Supabase Product Inventory Admin Modal */}
      <AdminOrdersPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentProducts={products}
        onProductSaved={handleProductSaved}
        onProductDeleted={handleProductDeleted}
      />

      <FloatingContact />
    </div>
  );
}
