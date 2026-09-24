// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingBag, Plus, FileText, X, MapPin } from "lucide-react";

export default function Header({
  cartCount = 0,
  products = [],
  onOpenCart,
  onOpenPrescription,
  onViewProduct,
  onAddToCart,
  searchQuery = "",
  setSearchQuery,
  mapsUrl = "https://www.google.com/maps?daddr=Booth+No.+13,+Sub.+City+Center,+35C,+Sector+35,+Chandigarh,+160022",
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live matching search results (up to 5 items)
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter((p) => {
        const name = (p.name || p.title || "").toLowerCase();
        const brand = (p.brand || p.brand_name || "").toLowerCase();
        const cat = (p.category || p.concern || "").toLowerCase();
        return name.includes(q) || brand.includes(q) || cat.includes(q);
      })
      .slice(0, 5);
  }, [searchQuery, products]);

  return (
    <header
      style={{
        position: "fixed",
        top: "12px",
        left: 0,
        right: 0,
        zIndex: 50,
      }}
      className="fixed top-2 sm:top-3 left-0 right-0 z-50 px-2.5 sm:px-6 pointer-events-none flex justify-center"
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.82)",
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
        }}
        className="w-full max-w-7xl rounded-full border border-white/80 shadow-[0_10px_35px_rgba(0,0,0,0.08)] px-3 sm:px-5 py-2 pointer-events-auto transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* 1. Static Brand Logo & Store Identity (Non-Clickable) */}
          <div className="flex items-center gap-2.5 shrink-0 select-none cursor-default">
            {/* Glossy Dark G Pill Badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#111c2e] to-[#060b13] border border-white/20 flex items-center justify-center text-emerald-400 font-extrabold text-base sm:text-lg font-mono shadow-sm">
              G
            </div>

            {/* Store Titles */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-none">
                  GETWELL MEDICOS
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100/90 text-slate-500 uppercase tracking-wider border border-slate-200/50">
                  STORE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                Healthcare & Skincare • Sector 35C
              </p>
            </div>
          </div>

          {/* 2. Apple Glass Translucent Search Bar */}
          <div
            ref={searchRef}
            className="flex-1 max-w-lg relative hidden md:block"
          >
            <div
              style={{
                backgroundColor: isSearchFocused
                  ? "rgba(255, 255, 255, 0.95)"
                  : "rgba(241, 245, 249, 0.7)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              className={`relative flex items-center transition-all duration-200 rounded-full border ${
                isSearchFocused
                  ? "border-emerald-500/80 ring-3 ring-emerald-500/15 shadow-md"
                  : "border-slate-200/60 hover:border-slate-300/80"
              }`}
            >
              <Search
                className={`w-3.5 h-3.5 ml-3.5 shrink-0 transition-colors ${
                  isSearchFocused ? "text-emerald-600" : "text-slate-400"
                }`}
              />

              <input
                type="text"
                placeholder="Search Cetaphil, Ahaglow, Ensure, Baby care, Vitamin D..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Apple Glass Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(24px) saturate(190%)",
                  WebkitBackdropFilter: "blur(24px) saturate(190%)",
                }}
                className="absolute top-full left-0 right-0 mt-3 border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">
                      No matching products found in counter stock
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tap below to order via WhatsApp Prescription
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchFocused(false);
                        onOpenPrescription && onOpenPrescription();
                      }}
                      className="mt-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      Upload Prescription on WhatsApp &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Matching Pharmacy Stock
                    </div>
                    {searchResults.map((item) => {
                      const title = item.name || item.title || "Medicine";
                      const brand = item.brand || item.brand_name || "Pharma";
                      const price =
                        Number(item.price || item.selling_price) || 0;
                      const thumb =
                        Array.isArray(item.image_urls) && item.image_urls[0]
                          ? item.image_urls[0]
                          : item.image_url ||
                            item.image ||
                            "/placeholder-med.png";

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 hover:bg-emerald-50/50 transition group cursor-pointer"
                          onClick={() => {
                            setIsSearchFocused(false);
                            onViewProduct && onViewProduct(item);
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={thumb}
                              alt={title}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100";
                              }}
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">
                                {title}
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">
                                {brand} •{" "}
                                <span className="text-emerald-600 font-bold font-mono">
                                  ₹{price}
                                </span>
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart && onAddToCart(item);
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xs transition active:scale-95 shrink-0 ml-2"
                            title="Add to Bag"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Action Glass Pills: Prescription + Locate + Bag */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Frosted Mint Prescription Pill */}
            <button
              type="button"
              onClick={onOpenPrescription}
              style={{
                backgroundColor: "rgba(236, 253, 245, 0.85)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Order via</span> Prescription
            </button>

            {/* Frosted Locate Pill */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "rgba(241, 245, 249, 0.75)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 rounded-full text-xs font-bold transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Locate</span>
            </a>

            {/* Frosted Shopping Bag Pill */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Open Shopping Bag"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              className="relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full hover:bg-white text-slate-900 border border-slate-200/70 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-800" />
              <span className="text-xs font-bold">Bag</span>

              {cartCount > 0 && (
                <span className="bg-emerald-600 text-white font-mono font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Glass Search Bar */}
        <div className="pt-2 pb-1 md:hidden">
          <div
            style={{
              backgroundColor: "rgba(241, 245, 249, 0.8)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            className="relative flex items-center rounded-full border border-slate-200/60"
          >
            <Search className="w-3.5 h-3.5 ml-3 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search medicines, skincare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 mr-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
