import React from 'react';

export default function Hero({ mapsUrl, onOpenPrescription }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#e5e2d9]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 bg-[#e4ede8] text-[#2c5240] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Sector 35C Pharmacy &bull; Verified 5.0 Rating (80+ Reviews)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071610] tracking-tight">
            Curated Clinical Skincare & Wellness
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl leading-relaxed">
            Authentic skincare, derma-cosmetics, and infant nutrition delivered directly from our physical counter at <strong>Booth No. 13, Sector 35C, Chandigarh</strong>.
          </p>

          {/* Rx / Allopathic Ordering Quick-Action Callout */}
          <div className="mt-4 inline-flex flex-col sm:flex-row sm:items-center gap-3 bg-[#f2f7f4] border border-[#cbe3d5] p-3.5 rounded-2xl">
            <div className="flex items-center gap-2.5 text-xs text-gray-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Need Allopathic or Prescription Medicines?</p>
                <p className="text-[11px] text-gray-500">Send doctor's Rx or unlisted item names for quick quote & delivery.</p>
              </div>
            </div>
            <button
              onClick={onOpenPrescription}
              className="bg-[#071610] hover:bg-[#1a382b] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <span>Order via WhatsApp Rx</span>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Store Info Card */}
        <div className="w-full md:w-auto bg-white p-5 rounded-2xl border border-[#d6d2c4] shadow-sm flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Physical Counter</p>
            <p className="text-sm font-bold text-gray-900">Booth 13, Sec 35C, Chandigarh</p>
            <p className="text-xs text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Open Today until 09:00 PM</span>
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Full-Range Allopathic Pharmacy</p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#071610] hover:bg-[#1a382b] text-white text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>Directions</span>
          </a>
        </div>
      </div>
    </section>
  );
}