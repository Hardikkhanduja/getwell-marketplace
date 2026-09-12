import React, { useState } from 'react';
import PolicyModal from './PolicyModal';

export default function Footer({ mapsUrl }) {
  const [activePolicy, setActivePolicy] = useState(null);

  return (
    <>
      <footer className="bg-[#071610] text-[#c2d6cc] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1a382b]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#1b3b2b] bg-[#071610] p-1 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="32" stroke="#e5e7eb" strokeWidth="2" opacity="0.25" />
                  <path d="M50 18C32.3 18 18 32.3 18 50C18 67.7 32.3 82 50 82C67.7 82 82 67.7 82 50H50" stroke="#f9fafb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 36V64M36 50H64" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-sm">GETWELL MEDICOS</p>
                <p className="text-gray-400 text-xs mt-0.5">Booth No. 13, Sector 35C, Chandigarh 160022</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                Google Maps Location
              </a>
              <span>•</span>
              <a href="tel:+919872633001" className="hover:text-white">
                +91 9872633001
              </a>
            </div>
          </div>

          {/* Mandatory Razorpay Compliance Policy Links */}
          <div className="pt-6 border-t border-[#1a382b] flex flex-wrap justify-between items-center gap-4 text-[11px] text-gray-400">
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setActivePolicy('terms')} className="hover:text-white underline">Terms & Conditions</button>
              <button onClick={() => setActivePolicy('privacy')} className="hover:text-white underline">Privacy Policy</button>
              <button onClick={() => setActivePolicy('shipping')} className="hover:text-white underline">Shipping & Delivery</button>
              <button onClick={() => setActivePolicy('refunds')} className="hover:text-white underline">Refund & Cancellation</button>
              <button onClick={() => setActivePolicy('contact')} className="hover:text-white underline">Contact Us</button>
            </div>
            <p>© {new Date().getFullYear()} Getwell Medicos. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <PolicyModal policyType={activePolicy} onClose={() => setActivePolicy(null)} />
    </>
  );
}
