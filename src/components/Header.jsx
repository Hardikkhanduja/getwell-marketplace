import React from 'react';

export default function Header({ searchQuery, setSearchQuery, mapsUrl, totalCartCount, onOpenCart, onOpenPrescription }) {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f5]/90 backdrop-blur-md border-b border-[#e5e2d9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-[#1b3b2b] bg-[#071610] p-1.5 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="32" stroke="#e5e7eb" strokeWidth="2" opacity="0.25" />
              <path
                d="M50 18C32.3 18 18 32.3 18 50C18 67.7 32.3 82 50 82C67.7 82 82 67.7 82 50H50"
                stroke="#f9fafb"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M50 36V64M36 50H64" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-[#071610]">GETWELL MEDICOS</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#e4ede8] text-[#2c5240] uppercase tracking-wider">
                Store
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">Healthcare &amp; Skincare &bull; Sector 35C</p>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Cetaphil, Dot & Key, Ensure, Baby care, Sunscreen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#d6d2c4] rounded-full py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#476556] focus:border-transparent transition-all shadow-sm"
            />
            <svg
              className="w-5 h-5 absolute left-3.5 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Action Buttons: Prescription Order + Locate + Bag */}
        <div className="flex items-center gap-2.5">
          {/* Quick Prescription Order Button */}
          <button
            onClick={onOpenPrescription}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Order via</span> Prescription
          </button>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#2c5240] bg-[#eaf2ee] hover:bg-[#dbe9e1] border border-[#c4ded0] rounded-xl transition-all"
          >
            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>Locate</span>
          </a>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-white border border-[#d6d2c4] text-[#071610] hover:bg-[#f3f0e6] transition-all shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-[#071610]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs font-bold hidden sm:inline">Bag</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#476556] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="p-3 border-t border-[#e5e2d9] md:hidden bg-[#f7f5ed]">
        <input
          type="text"
          placeholder="Search Cetaphil, Dot & Key, Baby care..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-[#d6d2c4] rounded-lg py-2 px-3 text-sm"
        />
      </div>
    </header>
  );
}