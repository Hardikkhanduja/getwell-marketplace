// src/components/Footer.jsx
import React from "react";
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  HeartHandshake,
} from "lucide-react";

export default function Footer({ onOpenPolicy }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">100% Genuine</p>
              <p className="text-xs text-slate-400">Direct pharma sourcing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800 rounded-xl text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                Tricity Express
              </p>
              <p className="text-xs text-slate-400">1–2 hr doorstep dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800 rounded-xl text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Easy Returns</p>
              <p className="text-xs text-slate-400">Damaged / wrong items</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800 rounded-xl text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                Licensed Chemist
              </p>
              <p className="text-xs text-slate-400">
                Serving Sec 35 since 1990s
              </p>
            </div>
          </div>
        </div>

        {/* Store Info & Policy Links */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-800">
          <div>
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Getwell Medicos
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Booth No. 13, Sector 35C, Chandigarh – 160022
            </p>
            <p className="text-xs text-slate-400">
              Helpline: +91 9872633001 / +91 9988604013
            </p>
          </div>

          {/* Legal Compliance Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start md:justify-center text-xs">
            <button
              onClick={() => onOpenPolicy("terms")}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onOpenPolicy("privacy")}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPolicy("shipping")}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Shipping Policy
            </button>
            <button
              onClick={() => onOpenPolicy("refund")}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Refund & Cancellation
            </button>
            <button
              onClick={() => onOpenPolicy("contact")}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          <div className="text-left md:text-right text-xs text-slate-400">
            <p className="text-white font-semibold">Store Timings:</p>
            <p>Mon – Sat: 9:00 AM – 9:00 PM</p>
            <p>Sunday: 10:00 AM – 2:00 PM</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>
            © {new Date().getFullYear()} Getwell Medicos. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500 inline" /> for
            Chandigarh Tricity
          </p>
        </div>
      </div>
    </footer>
  );
}
