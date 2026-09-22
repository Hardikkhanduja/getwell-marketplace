// src/components/PrescriptionModal.jsx
import React, { useState } from "react";
import { X, ShieldCheck, ArrowRight } from "lucide-react";

export default function PrescriptionModal({ isOpen, onClose }) {
  const [patientName, setPatientName] = useState("");
  const [patientLocation, setPatientLocation] = useState("");

  if (!isOpen) return null;

  const PHARMACIST_PHONE = "919872633001";

  const handleOpenWhatsApp = (e) => {
    e?.preventDefault();

    let message = `Hi Getwell Medicos (Sector 35C), I would like to order medicines.`;

    if (patientName.trim()) {
      message += `\n👤 Name: ${patientName.trim()}`;
    }
    if (patientLocation.trim()) {
      message += `\n📍 Sector / Area: ${patientLocation.trim()}`;
    }

    message += `\n\n📸 I am attaching my prescription / medicine photo below:`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${PHARMACIST_PHONE}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Subtle Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clean Header */}
        <div className="p-6 sm:p-7 pb-0 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sector 35C Pharmacist Desk</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
            Order Unlisted Medicines via WhatsApp
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Need allopathic tablets, syrups, or unlisted medicines? Send a photo
            of your doctor's prescription directly to our on-duty chemist.
          </p>
        </div>

        {/* Content & Inputs */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Quick Optional Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Your Name{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Gurpreet Singh"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Sector / Delivery Area{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sector 35-C / Phase 7 Mohali"
                value={patientLocation}
                onChange={(e) => setPatientLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          {/* 3 Simple Micro Steps */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span>Click the button below to open WhatsApp chat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span>Attach your prescription photo or type requirements</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span>
                Our pharmacist quotes the bill & arranges express dispatch
              </span>
            </div>
          </div>

          {/* Primary Action Button with Your WhatsApp Logo */}
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
          >
            <img
              src="/whatsapp.png"
              alt="WhatsApp"
              className="w-5 h-5 object-contain flex-shrink-0"
            />
            <span>Chat on WhatsApp & Attach Rx</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Chemist Verification Tag */}
          <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Licensed Chemist • Booth 13, Sec 35C Chandigarh</span>
          </p>
        </div>
      </div>
    </div>
  );
}
