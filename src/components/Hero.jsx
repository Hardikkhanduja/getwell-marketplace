// src/components/Hero.jsx
import React from "react";
import {
  FileText,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from "lucide-react";

export default function Hero({ onOpenPrescription }) {
  // Check Sunday vs Mon-Sat for dynamic timing badge
  const isSunday = new Date().getDay() === 0;
  const closingTime = isSunday ? "03:00 PM" : "09:00 PM";

  return (
    <section className="bg-white py-10 sm:py-14 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Column: Heading & Prescription Card */}
          <div className="max-w-2xl space-y-4">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Sector 35C Pharmacy • Verified 5.0 Rating (80+ Reviews)
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Curated Clinical Skincare & Wellness
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Authentic skincare, derma-cosmetics, and infant nutrition
              delivered directly from our physical counter at Booth No. 13,
              Sector 35C, Chandigarh.
            </p>

            {/* Green Prescription Quick-Order Banner */}
            <div className="p-3.5 sm:p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-700 text-white rounded-xl flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-emerald-950">
                    Need Allopathic or Prescription Medicines?
                  </h3>
                  <p className="text-[11px] text-emerald-800">
                    Send doctor's Rx or unlisted item names for quick quote &
                    delivery.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPrescription}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition whitespace-nowrap cursor-pointer active:scale-95"
              >
                <span>Order via WhatsApp Rx</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Physical Counter Badge */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between lg:justify-start gap-6 max-w-md">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Physical Counter
                </p>
                <h4 className="text-sm font-bold text-slate-900">
                  Booth 13, Sec 35C, Chandigarh
                </h4>
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Open Today until {closingTime}
                </p>
                <p className="text-[11px] text-slate-400">
                  Full-Range Allopathic Pharmacy
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Getwell+Medicos+Sector+35C+Chandigarh"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer flex-shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
