import React, { useState, useEffect } from 'react';

export default function ProductModal({ product, quantity, setQuantity, onClose, onAddToCart, onBuyNow }) {
  if (!product) return null;

  // Normalize image list
  const imageList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // Fullscreen HD Lightbox state
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 }); // Hover zoom position
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setActiveImgIndex(0);
    setIsZoomed(false);
  }, [product]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 relative shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] overflow-y-auto">
          
          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors z-10"
          >
            ✕
          </button>

          {/* Product Header Section */}
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            
            {/* INTERACTIVE ZOOMABLE IMAGE CONTAINER */}
            <div className="flex flex-col items-center shrink-0 w-full sm:w-48">
              
              {/* Main Image Box with Hover Magnifier */}
              <div 
                onClick={() => setIsZoomed(true)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
                title="Click to view Fullscreen HD"
                className="w-full h-48 sm:h-52 bg-[#fbfbfa] border border-gray-200 rounded-2xl p-2 flex items-center justify-center relative group cursor-zoom-in overflow-hidden shadow-inner"
              >
                <img
                  src={imageList[activeImgIndex]}
                  alt={`${product.name} view ${activeImgIndex + 1}`}
                  style={
                    isHovering
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          transform: 'scale(2.2)',
                        }
                      : { transform: 'scale(1)' }
                  }
                  className="max-h-full max-w-full object-contain transition-transform duration-100 ease-out pointer-events-none"
                />

                {/* Tap to Zoom Badge */}
                {!isHovering && (
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>🔍 Tap to Zoom</span>
                  </div>
                )}

                {/* Slider Navigation Arrows (if 2+ photos) */}
                {imageList.length > 1 && !isHovering && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 hover:bg-white flex items-center justify-center text-xs font-bold transition-all"
                    >
                      ❮
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 hover:bg-white flex items-center justify-center text-xs font-bold transition-all"
                    >
                      ❯
                    </button>

                    <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
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
                  ₹{product.originalPrice}
                </span>
                <span className="text-xl font-extrabold text-[#071610]">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
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
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Verified Fresh Batch & Expiry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">⚡</span>
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
                <span>⚡ Buy Now</span>
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
            >
              ✕
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
                >
                  ❮
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center text-sm font-bold shadow-lg transition-all"
                >
                  ❯
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
