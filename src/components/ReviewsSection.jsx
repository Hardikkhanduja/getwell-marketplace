import React from 'react';

const REVIEWS = [
  {
    id: 1,
    name: "Dr. Ananya Sood",
    location: "Sector 35-D, Chandigarh",
    rating: 5,
    date: "2 days ago",
    comment: "Cetaphil cleanser and moisturiser arrived within 45 mins in Sec 35. 100% genuine sealed batch with 2026 expiry. Seamless service!",
    item: "Cetaphil Gentle Skin Cleanser"
  },
  {
    id: 2,
    name: "Vikram Malhotra",
    location: "Phase 7, Mohali",
    rating: 5,
    date: "3 days ago",
    comment: "Ordered Dot & Key sunscreen and baby wash. Best part is you can order unlisted allopathic syrups on WhatsApp right away.",
    item: "Dot & Key SPF 50 Sunscreen"
  },
  {
    id: 3,
    name: "Meenakshi Sharma",
    location: "Sector 22-B, Chandigarh",
    rating: 5,
    date: "5 days ago",
    comment: "Longtime customer of their Sector 35C counter. So glad they now offer online ordering with instant bike delivery across Tricity.",
    item: "Sebamed Baby Gentle Wash"
  },
  {
    id: 4,
    name: "Harjot Singh",
    location: "Sector 70, Mohali",
    rating: 5,
    date: "1 week ago",
    comment: "The photo inspection feature allowed me to check the actual packaging batch before buying Ensure powder. Genuine pharmacy.",
    item: "Ensure Nutrition Drink"
  },
  {
    id: 5,
    name: "Pooja Verma",
    location: "Sector 15, Panchkula",
    rating: 5,
    date: "1 week ago",
    comment: "Ordered Sebamed shampoo. Delivered fresh and sealed. Responsive team on WhatsApp!",
    item: "Sebamed Anti-Dandruff Shampoo"
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    location: "Sector 38, Chandigarh",
    rating: 5,
    date: "2 weeks ago",
    comment: "Prompt delivery, proper GST invoice, and authentic products. Very dependable pharmacy in Chandigarh.",
    item: "HK Vitals Multivitamin"
  },
  {
    id: 7,
    name: "Simran Kaur",
    location: "Sector 34, Chandigarh",
    rating: 5,
    date: "3 weeks ago",
    comment: "I always pick up my skincare from Getwell Medicos. Online checkout is fast and easy with Razorpay UPI.",
    item: "The Derma Co 1% Hyaluronic Gel"
  },
  {
    id: 8,
    name: "Amit Bansal",
    location: "MDC Sector 4, Panchkula",
    rating: 5,
    date: "1 month ago",
    comment: "Excellent service and honest pricing. The pharmacist explained dosage clearly on WhatsApp.",
    item: "Himalaya Baby Lotion"
  }
];

export default function ReviewsSection() {
  const marqueeList = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-14 bg-[#faf9f5] border-t border-[#e5e2d9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f2ec] text-[#2c5240] text-xs font-bold mb-2">
            <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>5.0 Star Rated on Google (Chandigarh &amp; Tricity)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071610]">
            Trusted by Thousands Across Tricity
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Real experiences from patients and customers across Chandigarh, Mohali, and Panchkula.
          </p>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Hover or touch to pause
        </div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Edge Blur Gradient */}
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#faf9f5] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#faf9f5] to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-5 w-max animate-marquee py-2">
          {marqueeList.map((rev, index) => (
            <div
              key={index}
              className="w-80 sm:w-96 bg-white rounded-2xl border border-[#e2ded2] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between shrink-0"
            >
              <div>
                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {rev.date}
                  </span>
                </div>

                {/* Purchased Item Tag */}
                <div className="mb-2.5">
                  <span className="text-[10px] font-semibold text-[#1e4e37] bg-[#eaf3ee] px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                    <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Verified: {rev.item}</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & City */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">{rev.name}</p>
                  <p className="text-[10px] text-gray-500">{rev.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Google Review
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}