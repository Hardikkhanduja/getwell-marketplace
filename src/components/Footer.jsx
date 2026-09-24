// src/components/Footer.jsx
import React from "react";
import {
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Truck,
  Award,
  Heart,
} from "lucide-react";

export default function Footer({ onOpenPolicy }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3.5 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                100% Genuine Pharmacy
              </h4>
              <p className="text-xs text-slate-400">
                Direct pharma-grade stock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                90-Min Tricity Dispatch
              </h4>
              <p className="text-xs text-slate-400">
                Chandigarh, Mohali & Panchkula
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                20+ Years Trusted
              </h4>
              <p className="text-xs text-slate-400">
                Serving Sector 35C patients
              </p>
            </div>
          </div>
        </div>

        {/* Store Info & Regulatory Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-b border-slate-800">
          {/* Store Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  Getwell Medicos
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Licensed Pharmacy
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Your trusted neighborhood chemist for allopathic medicines,
                dermatologist skincare, nutraceuticals, surgicals, and baby
                care.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Booth No. 13, Sector 35C, Chandigarh – 160022</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Mon – Sat: 9:00 AM – 9:00 PM | Sun: 10:00 AM – 3:00 PM
                </span>
              </div>

              {/* Separate Clickable Phone Numbers */}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="tel:+919872633001"
                  className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition font-semibold"
                >
                  +91 9872633001
                </a>
                <span className="text-slate-500">/</span>
                <a
                  href="tel:+919988604013"
                  className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition font-semibold"
                >
                  +91 9988604013
                </a>
              </div>
            </div>
          </div>

          {/* Policies & Customer Support */}
          <div className="md:text-right space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Customer Support & Legal Policies
            </span>
            <div className="flex flex-wrap md:justify-end gap-2 text-xs">
              {[
                "Terms & Conditions",
                "Privacy Policy",
                "Shipping & Delivery",
                "Refund & Returns",
                "Contact Us",
              ].map((policy) => (
                <button
                  key={policy}
                  onClick={() => onOpenPolicy && onOpenPolicy(policy)}
                  className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700/60 cursor-pointer"
                >
                  {policy}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Licensed under Drugs and Cosmetics Act • Cold-Chain Storage
              Verified
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            © {new Date().getFullYear()} Getwell Medicos. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for
            Chandigarh Tricity Patients
          </p>
        </div>
      </div>
    </footer>
  );
}
