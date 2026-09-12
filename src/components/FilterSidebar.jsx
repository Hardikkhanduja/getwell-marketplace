import React from 'react';

export default function FilterSidebar({ brands, selectedBrand, onSelectBrand, maxPrice, onPriceChange }) {
  return (
    <aside className="lg:col-span-1 space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#e5e2d9] shadow-sm space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Filter by Brand</h3>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => onSelectBrand(b)}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md transition-all ${
                  selectedBrand === b ? 'bg-[#e4ede8] font-bold text-[#1f4231]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Max Budget</h3>
            <span className="text-xs font-bold text-[#2c5240]">₹{maxPrice}</span>
          </div>
          <input
            type="range"
            min="200"
            max="3000"
            step="50"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-[#476556] cursor-pointer"
          />
        </div>

        {/* Delivery Transparency Box */}
        <div className="pt-4 border-t border-gray-100 bg-[#faf9f5] -mx-5 -mb-5 p-4 rounded-b-2xl">
          <h4 className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
            <span>⚡</span> Dispatch & Delivery
          </h4>
          <p className="text-[11px] text-gray-600 leading-normal">
            <strong>Local Tricity:</strong> Quick bike dispatch at direct distance fare.<br />
            <strong>All India:</strong> Postal Speed Post per weight parcel.<br />
            <span className="text-emerald-800 font-semibold">Free shipping on orders above ₹799!</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
