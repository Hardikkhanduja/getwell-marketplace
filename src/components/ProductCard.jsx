// src/components/ProductCard.jsx
import React from "react";
import { Plus, Eye, Camera, ShieldCheck } from "lucide-react";

export default function ProductCard({ product, onAddToCart, onViewProduct }) {
  if (!product) return null;

  // 1. Resolve Title / Name across all possible database columns
  const displayName =
    product.name ||
    product.title ||
    product.product_name ||
    "Pharmacy Medicine";

  // 2. Resolve Brand
  const displayBrand =
    product.brand ||
    product.brand_name ||
    product.manufacturer ||
    "Pharma Grade";

  // 3. Resolve Category
  const displayCategory =
    product.category ||
    product.concern ||
    product.skin_concern ||
    "Clinical Skincare";

  // 4. Resolve Pack Size / Unit
  const displayUnit =
    product.unit || product.size_volume || product.pack_size || "";

  // 5. Pricing
  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp || product.original_price) || price;
  const discountPercent =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // 6. Resolve Images (Handles Array, Single URL, or fallback)
  let imageUrls = [];
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    imageUrls = product.image_urls;
  } else if (
    typeof product.image_url === "string" &&
    product.image_url.trim()
  ) {
    imageUrls = [product.image_url.trim()];
  } else if (typeof product.image === "string" && product.image.trim()) {
    imageUrls = [product.image.trim()];
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    imageUrls = product.images;
  } else {
    imageUrls = [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    ];
  }

  const primaryImage = imageUrls[0];
  const photoCount = imageUrls.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Product Image Area */}
      <div className="relative bg-slate-50 p-4 aspect-square flex items-center justify-center overflow-hidden border-b border-slate-100">
        {/* Discount Tag */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Multi-Photo Count Tag */}
        {photoCount > 1 && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Camera className="w-3 h-3 text-emerald-400" />
            {photoCount} Photos
          </span>
        )}

        {/* Product Image */}
        <img
          src={primaryImage}
          alt={displayName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Quick View / Magnifier Overlay Button */}
        <button
          type="button"
          onClick={() => onViewProduct && onViewProduct(product)}
          className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <span className="px-3.5 py-1.5 bg-white/95 text-slate-900 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 hover:bg-white transition">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            Inspect & Zoom
          </span>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="uppercase tracking-wider font-bold text-emerald-700 truncate max-w-[120px]">
              {displayCategory}
            </span>
            <span className="text-slate-400 font-medium truncate max-w-[100px]">
              {displayBrand}
            </span>
          </div>

          <h3
            onClick={() => onViewProduct && onViewProduct(product)}
            className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-emerald-600 transition cursor-pointer leading-snug"
            title={displayName}
          >
            {displayName}
          </h3>

          {displayUnit && (
            <p className="text-[11px] text-slate-400 mt-1">
              Pack:{" "}
              <span className="font-semibold text-slate-600">
                {displayUnit}
              </span>
            </p>
          )}
        </div>

        {/* Price & Add to Bag CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-emerald-700">
                ₹{price}
              </span>
              {mrp > price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{mrp}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Inclusive of GST</p>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(product)}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center"
            title="Add to Bag"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
