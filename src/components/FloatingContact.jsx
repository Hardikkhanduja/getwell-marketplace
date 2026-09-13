import React from 'react';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Instant Phone Call */}
      <a
        href="tel:+919872633001"
        aria-label="Call Store"
        title="Call Pharmacist (+91 9872633001)"
        className="w-12 h-12 rounded-full bg-[#071610] hover:bg-[#1a382b] text-white shadow-xl border border-[#2b4c3b] flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
      >
        <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
        </svg>
        <span className="absolute right-14 bg-gray-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Call Store
        </span>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919872633001?text=Hi%20Getwell%20Medicos,%20I%20have%20an%20inquiry%20regarding%20a%20product%20or%20prescription."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat with Pharmacist on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
        <span className="absolute right-14 bg-gray-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          WhatsApp Store
        </span>
      </a>
    </div>
  );
}