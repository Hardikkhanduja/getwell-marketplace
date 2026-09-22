// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  FileText,
  MapPin,
  X,
  ArrowRight,
  Sparkles,
  Plus,
} from "lucide-react";

export default function Header({
  cartCount = 0,
  products = [],
  onOpenCart,
  onOpenPrescription,
  onViewProduct,
  onAddToCart,
  searchQuery,
  setSearchQuery,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products for live dropdown
  const searchResults = searchQuery.trim()
    ? products
        .filter((p) => {
          const name = (p.name || p.title || "").toLowerCase();
          const brand = (p.brand || p.brand_name || "").toLowerCase();
          const cat = (p.category || p.concern || "").toLowerCase();
          const q = searchQuery.toLowerCase().trim();
          return name.includes(q) || brand.includes(q) || cat.includes(q);
        })
        .slice(0, 5) // Top 5 quick matches
    : [];

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    if (onViewProduct) onViewProduct(product);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-xs">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
                  GETWELL MEDICOS
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded uppercase">
                  STORE
                </span>
              </div>
              <span className="text-xs text-slate-400 block leading-tight">
                Healthcare & Skincare • Sector 35C
              </span>
            </div>
          </a>

          {/* Centered Search Bar with LIVE INSTANT DROPDOWN */}
          <div
            ref={searchRef}
            className="relative hidden md:flex flex-1 max-w-lg mx-4"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Cetaphil, Ahaglow, Ensure, Baby care, Vitamin D..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full pl-9 pr-9 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Popup Card */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-fadeIn">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>Matching Medicines ({searchResults.length})</span>
                  <span>Sector 35C Inventory</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-5 text-center space-y-2">
                      <p className="text-xs text-slate-700 font-bold">
                        No listed product matching "{searchQuery}"
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Looking for unlisted prescription medicines or syrups?
                      </p>
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          if (onOpenPrescription) onOpenPrescription();
                        }}
                        className="mt-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 mx-auto"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Order via WhatsApp Rx</span>
                      </button>
                    </div>
                  ) : (
                    searchResults.map((item) => {
                      const img =
                        (item.image_urls && item.image_urls[0]) ||
                        item.image_url ||
                        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300";
                      const title = item.name || item.title;
                      const brand = item.brand || item.brand_name || "Pharma";

                      return (
                        <div
                          key={item.id}
                          className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3 transition cursor-pointer group"
                          onClick={() => handleSelectProduct(item)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                              <img
                                src={img}
                                alt={title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">
                                {title}
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate">
                                {brand} {item.unit ? `• ${item.unit}` : ""}
                              </p>
                              <p className="text-xs font-bold text-emerald-700 mt-0.5">
                                ₹{item.price}{" "}
                                {item.mrp > item.price && (
                                  <span className="text-[10px] text-slate-400 line-through">
                                    ₹{item.mrp}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onAddToCart) onAddToCart(item);
                            }}
                            className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl transition flex-shrink-0"
                            title="Add to Bag"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-500">
                      Press Enter to view all results in catalog
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenPrescription}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-xl text-xs font-semibold transition cursor-pointer border border-emerald-100"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Order via Prescription</span>
            </button>

            <a
              href="https://maps.google.com/?q=Getwell+Medicos+Sector+35C+Chandigarh"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium transition"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Locate</span>
            </a>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="p-2 sm:px-3.5 sm:py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center gap-2 shadow-xs transition cursor-pointer active:scale-95"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Cetaphil, Ahaglow, Ensure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-900 focus:outline-none transition"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
