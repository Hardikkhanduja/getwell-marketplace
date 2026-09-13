import React from 'react';

export default function FilterSidebar({ brands, selectedBrand, onSelectBrand, maxPrice, onPriceChange }) {
  return (
    <aside className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-2xl border border-[#e5e2d9] p-5 shadow-sm space-y-6">
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Brands</h3>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => onSelectBrand(brand)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedBrand === brand
                    ? 'bg-[#071610] text-white'
                    : 'text-gray-600 hover:bg-[#f2efe6]'
                }`}
              >
                <span>{brand}</span>
                {selectedBrand === brand && (
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Max Budget</h3>
            <span className="text-xs font-extrabold text-[#071610]">&#8377;{maxPrice}</span>
          </div>
          <input
            type="range"
            min="200"
            max="2500"
            step="50"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-[#071610] cursor-pointer"
          />
        </div>

        {/* Delivery Transparency Box */}
        <div className="pt-4 border-t border-gray-100 bg-[#faf9f5] -mx-5 -mb-5 p-4 rounded-b-2xl">
          <h4 className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Dispatch & Delivery</span>
          </h4>
          <p className="text-[11px] text-gray-600 leading-normal">
            <strong>Local Tricity:</strong> Quick bike dispatch at direct distance fare.<br />
            <strong>All India:</strong> Postal Speed Post per weight parcel.<br />
            <span className="text-emerald-800 font-semibold">Free shipping on orders above &#8377;799!</span>
          </p>
        </div>
      </div>
    </aside>
  );
}