import React, { useState } from 'react';

export default function ProductModal({ product, quantity, setQuantity, onClose, onAddToCart, onBuyNow }) {
  if (!product) return null;

  const imageList = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 relative shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors z-10"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Multi-Image Interactive Slider & 2.2x Zoom View */}
            <div className="w-full sm:w-1/2 flex flex-col items-center">
              <div 
                className="w-full h-64 sm:h-72 bg-[#fbfbfa] border border-gray-200/80 rounded-2xl overflow-hidden relative group cursor-crosshair flex items-center justify-center p-3"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsZoomed(true)}
                title="Hover to magnify | Click for Fullscreen Inspection"
              >
                <img
                  src={imageList[activeImgIndex]}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80";
                  }}
                  style={zoomStyle}
                  className="max-h-full max-w-full object-contain transition-transform duration-100 pointer-events-none"
                />

                {/* Inspection Hint Pill */}
                <div className="absolute top-2 right-2 bg-black/65 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>2.2x Zoom & HD Lightbox</span>
                </div>

                {/* Slider Nav Arrows */}
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                      aria-label="Next image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {activeImgIndex + 1} / {imageList.length}
                    </span>
                  </>
                )}
              </div>

              {/* Clickable Mini Thumbnails */}
              {imageList.length > 1 && (
                <div className="flex items-center gap-2 mt-2.5 overflow-x-auto py-1 max-w-full">
                  {imageList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-12 h-12 rounded-lg border-2 overflow-hidden p-0.5 bg-[#fbfbfa] shrink-0 transition-all ${
                        activeImgIndex === idx
                          ? 'border-[#071610] shadow-md scale-105'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Pricing */}
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-2 leading-snug">
                {product.name}
              </h3>

              <div className="mt-2 flex items-center justify-center sm:justify-start gap-2.5">
                <span className="text-xs text-gray-400 line-through">
                  &#8377;{product.originalPrice}
                </span>
                <span className="text-xl font-extrabold text-[#071610]">
                  &#8377;{product.price}
                </span>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Product Description & Benefits
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Verified Guarantee */}
          <div className="mt-4 grid grid-cols-2 gap-2 bg-[#faf9f5] border border-gray-200/60 rounded-xl p-3 text-[11px] text-gray-700">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Verified Fresh Batch & Expiry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Same-Day Tricity Dispatch</span>
            </div>
          </div>

          {/* Quantity Selector & CTAs */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-gray-900 bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={() => onAddToCart(product, null, quantity)}
                className="w-full bg-white hover:bg-gray-50 text-[#071610] border-2 border-[#071610] py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 text-[#071610]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => onBuyNow(product, quantity)}
                className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN HD INSPECTION LIGHTBOX (For reading Expiry / Batch text) */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="absolute top-5 right-5 flex items-center gap-3">
            <span className="text-white text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Photo {activeImgIndex + 1} of {imageList.length} • Click anywhere to close
            </span>
            <button
              onClick={() => setIsZoomed(false)}
              className="w-9 h-9 rounded-full bg-white/30 hover:bg-white text-white hover:text-black flex items-center justify-center text-base font-bold transition-all"
              aria-label="Close zoom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center relative p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageList[activeImgIndex]}
              alt="Fullscreen Inspection"
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl bg-white/5 p-2"
            />

            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center text-sm font-bold shadow-lg transition-all"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center text-sm font-bold shadow-lg transition-all"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}