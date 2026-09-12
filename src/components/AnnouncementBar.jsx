import React from 'react';

export default function AnnouncementBar({ mapsUrl }) {
  return (
    <div className="bg-[#071610] text-[#c2d6cc] text-xs py-2 px-4 border-b border-[#1c3026]">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Chandigarh Store Open (9:00 AM - 9:00 PM) • 100% Genuine OTC & Clinical Products</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors underline decoration-dotted"
          >
            <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Booth 13, Sec 35C, Chandigarh (Get Directions)
          </a>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <a href="tel:+919872633001" className="hover:text-white hidden sm:inline">
            📞 +91 9872633001
          </a>
        </div>
      </div>
    </div>
  );
}
