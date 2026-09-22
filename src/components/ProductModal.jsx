// src/components/ProductModal.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Sparkles,
  Camera,
  Maximize2,
} from "lucide-react";

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setIsLightboxOpen(false);
  }, [product]);

  if (!product) return null;

  // 1. Resolve Fields
  const displayName = product.name || product.title || "Pharmacy Product";
  const displayBrand = product.brand || product.brand_name || "Torrent Pharma";
  const displayCategory =
    product.category || product.concern || "Clinical Skincare";
  const displayUnit = product.unit || product.size_volume || "";
  const displayDescription =
    product.description ||
    "Authentic clinical formulation inspected directly at Booth No. 13, Sector 35C counter.";
  const displayExpiry = product.expiry_date || "Verified Fresh Batch";

  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp || product.original_price) || price;
  const discountPercent =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // 2. Resolve Images
  let images = [];
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    images = product.image_urls;
  } else if (
    typeof product.image_url === "string" &&
    product.image_url.trim()
  ) {
    images = [product.image_url.trim()];
  } else if (typeof product.image === "string" && product.image.trim()) {
    images = [product.image.trim()];
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    images = product.images;
  } else {
    images = [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600",
    ];
  }

  const currentImage = images[selectedImageIndex] || images[0];

  // 3. Mouse Zoom Handler (2.2x Magnifier)
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: "block",
      backgroundImage: `url(${currentImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "220%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Sticky Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100/90 hover:bg-slate-200 text-slate-600 rounded-full transition cursor-pointer shadow-xs"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Product Images & 2.2x Zoom Magnifier */}
            <div className="space-y-4">
              <div
                className="relative bg-slate-50 rounded-2xl border border-slate-200 aspect-square overflow-hidden flex items-center justify-center cursor-crosshair group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  2.2x Zoom & HD Lightbox
                </div>

                {/* Primary Image */}
                <img
                  src={currentImage}
                  alt={displayName}
                  className="w-full h-full object-contain p-4 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600";
                  }}
                />

                {/* Hover Magnifier Zoom View */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-150"
                  style={zoomStyle}
                />

                {/* Fullscreen Lightbox Button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 right-3 z-10 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md transition cursor-pointer"
                  title="Fullscreen HD View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Multi-Photo Thumbnail Bar */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 p-1 flex-shrink-0 transition cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-emerald-600 ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`thumbnail-${idx}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Buying Actions */}
            <div className="space-y-5">
              <div>
                <span className="inline-block bg-emerald-50 text-emerald-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider mb-2">
                  {displayBrand}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {displayName}
                </h2>

                {displayUnit && (
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Pack Size:{" "}
                    <strong className="text-slate-800">{displayUnit}</strong>
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-700">
                      ₹{price}
                    </span>
                    {mrp > price && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{mrp}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Inclusive of all taxes & GST
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-900 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Batch: {displayExpiry}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-700 font-medium">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Same-Day Sec 35 Dispatch</span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">
                  Quantity
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-l-xl transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-r-xl transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                    onClose();
                  }}
                  className="py-3.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Add to Bag
                </button>

                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                    onClose();
                  }}
                  className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-98"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom: Rich Description & Clinical Highlights */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Description & Benefits
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              {displayDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen HD Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage}
            alt="Fullscreen view"
            className="max-w-full max-h-[85vh] object-contain"
          />
          <p className="text-white text-xs mt-3 font-mono">
            {displayName} • HD Inspection Mode
          </p>
        </div>
      )}
    </div>
  );
}
