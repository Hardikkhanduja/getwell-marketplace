// src/components/StoreLocationSection.jsx
import React from "react";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

export default function StoreLocationSection() {
  return (
    <section className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#faf9f5] border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Store Details */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-bold tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full uppercase">
                Physical Pharmacy Counter
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Visit Getwell Medicos
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step into our fully stocked pharmacy for allopathic prescription
                medicines, cold-chain storage drugs, and personal healthcare
                consultation.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Address:</strong> Booth No. 13, Sector 35C,
                    Chandigarh – 160022
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>
                    <strong>Hours:</strong> Mon – Sat: 9:00 AM – 9:00 PM | Sun:
                    10:00 AM – 3:00 PM
                  </span>
                </div>

                {/* Separate Clickable Phone Numbers */}
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Phone:</strong>
                  </span>
                  <a
                    href="tel:+919872633001"
                    className="font-mono text-emerald-700 hover:text-emerald-800 hover:underline transition font-bold"
                  >
                    +91 9872633001
                  </a>
                  <span className="text-slate-400">/</span>
                  <a
                    href="tel:+919988604013"
                    className="font-mono text-emerald-700 hover:text-emerald-800 hover:underline transition font-bold"
                  >
                    +91 9988604013
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Getwell+Medicos+Sector+35C+Chandigarh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-md cursor-pointer"
                >
                  <span>Open Directions in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Official Google Maps Live Embed */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-72 sm:h-80 bg-white">
              <iframe
                title="Getwell Medicos Official Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3429.7937811482807!2d76.75769267558003!3d30.72419727458833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fedb68f78ad7f%3A0x3f214a436dd38141!2sGetwell%20Medicos%20%7C%20Chemist%20in%20Chandigarh%20%7C%20Allopathic%20%7C%20Cosmetics%7C%20Surgical%20Items!5e0!3m2!1sen!2sin!4v1790245131195!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
