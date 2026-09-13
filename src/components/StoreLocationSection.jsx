import React from 'react';

export default function StoreLocationSection({ mapsUrl }) {
  return (
    <section className="bg-white border-y border-[#e5e2d9] py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f2ec] text-[#2c5240] text-xs font-bold mb-3">
            <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>Verified Physical Pharmacy in Sector 35C</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#071610]">Visit Us in Person or Order Online</h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Prefer speaking with our pharmacist directly or picking up your wellness kit immediately? Drop by our physical counter in Sector 35C Chandigarh.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#faf9f5] border border-gray-200 text-gray-700 shrink-0">
                <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Address</p>
                <p className="text-xs text-gray-600">Booth No. 13, Sub. City Center, 35C, Sector 35, Chandigarh, 160022</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#faf9f5] border border-gray-200 text-gray-700 shrink-0">
                <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Store Timings</p>
                <p className="text-xs text-gray-600">Monday &ndash; Sunday: 9:00 AM &ndash; 09:00 PM (All 7 Days)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#faf9f5] border border-gray-200 text-gray-700 shrink-0">
                <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Direct Helpline</p>
                <a href="tel:+919872633001" className="text-xs text-[#2c5240] font-semibold underline">
                  +91 9872633001
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#071610] hover:bg-[#203c2e] text-white text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>Get Directions (Google Maps)</span>
            </a>

            <a
              href="https://wa.me/919872633001?text=Hi%20Getwell%20Medicos,%20I%20have%20an%20inquiry%20regarding%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#e9f7ef] hover:bg-[#d4edd9] text-[#1e6f42] border border-[#b2ddbe] text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4" />
              <span>WhatsApp Counter</span>
            </a>
          </div>
        </div>

        {/* Live Interactive Google Maps Iframe */}
        <div className="relative rounded-2xl overflow-hidden border border-[#d6d2c4] shadow-md bg-gray-100 h-80 sm:h-96">
          <iframe
            title="Getwell Medicos Google Map"
            src="https://maps.google.com/maps?q=Booth+No.+13,+Sub.+City+Center,+35C,+Sector+35,+Chandigarh,+160022&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md border border-gray-200 flex items-center gap-1.5 transition-all"
          >
            <span>Open in Maps</span>
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}