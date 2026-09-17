// src/components/StoreLocationSection.jsx
import React from "react";
import { MapPin, Clock, Phone, Navigation, ShieldCheck } from "lucide-react";

export default function StoreLocationSection() {
  return (
    <section className="bg-white py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Store Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Physical Retail Pharmacy
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Visit Our Sector 35C Counter
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Walk in for doctor's prescription dispensing, dermatological
              consultations, or collect your online express order directly at
              our counter.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-slate-100 rounded-xl text-emerald-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Address</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Booth No. 13, Sector 35C Market, Chandigarh – 160022
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-slate-100 rounded-xl text-emerald-600 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Store Hours
                  </h4>
                  <p className="text-xs text-slate-700 mt-0.5 font-medium">
                    <span className="text-slate-900 font-bold">Mon – Sat:</span>{" "}
                    9:00 AM – 9:00 PM
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5 font-medium">
                    <span className="text-slate-900 font-bold">Sunday:</span>{" "}
                    10:00 AM – 2:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-slate-100 rounded-xl text-emerald-600 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Helpline / WhatsApp
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    +91 9872633001 / +91 9988604013
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Getwell+Medicos+Sector+35C+Chandigarh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Navigation className="w-4 h-4" />
                Get Driving Directions on Google Maps
              </a>
            </div>
          </div>

          {/* Embedded Google Maps */}
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <iframe
              title="Getwell Medicos Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.076632420455!2d76.7626915!3d30.7162544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0081e7bf2f%3A0x6b9dcfbd2c8e31a0!2sSector%2035C%2C%20Sector%2035%2C%20Chandigarh%2C%20160022!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
