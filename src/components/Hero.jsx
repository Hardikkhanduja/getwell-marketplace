import React from 'react';

export default function Hero({ mapsUrl }) {
  return (
    <section className="bg-gradient-to-b from-[#eef4f0] to-[#faf9f5] border-b border-[#e5e2d9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-3">
            <span>★ 4.8 / 5 on Google Reviews (1000+ Verified Customers)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071610] tracking-tight leading-tight">
            Chandigarh’s Trusted Health & Skincare Counter - Now Online
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            Guaranteed fresh batches, authentic clinical formulations, and non-prescription wellness delivered across Tricity. For specialized allopathic prescriptions, connect with our licensed pharmacists on WhatsApp.
          </p>
        </div>

        {/* Quick Store Info Card */}
        <div className="w-full md:w-auto bg-white p-4 rounded-xl border border-[#d6d2c4] shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Physical Counter</p>
            <p className="text-sm font-bold text-gray-900">Booth 13, Sec 35C, Chandigarh</p>
            <p className="text-xs text-emerald-700 font-medium mt-0.5">● Open Today until 09:00 PM</p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#071610] hover:bg-[#1a382b] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Directions
          </a>
        </div>
      </div>
    </section>
  );
}
