import React from 'react';

export default function ProductCard({ product, onSelect, onAddToCart }) {
  const primaryImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : product.image;

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-[#e5e2d9] p-4 flex flex-col justify-between hover:shadow-lg hover:border-[#476556]/40 transition-all cursor-pointer relative"
    >
      <div>
        <div className="w-full h-48 bg-[#fbfbfa] rounded-xl overflow-hidden flex items-center justify-center p-3 relative mb-3">
          <img
            src={primaryImage}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80";
            }}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2.5 left-2.5 bg-[#071610]/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            {product.brand}
          </span>
          {discountPercent > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          )}
          {product.images && product.images.length > 1 && (
            <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{product.images.length} Photos</span>
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-400 uppercase font-medium">{product.category}</p>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5 leading-snug group-hover:text-[#2c5240] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">{product.description}</p>
      </div>

      <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 line-through mr-1.5">&#8377;{product.originalPrice}</span>
          <span className="text-base font-extrabold text-[#071610]">&#8377;{product.price}</span>
        </div>
        <button
          onClick={(e) => onAddToCart(product, e, 1)}
          className="bg-[#071610] hover:bg-[#2c5240] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1"
        >
          <span>+ Add</span>
        </button>
      </div>
    </div>
  );
}