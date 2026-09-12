import React from 'react';

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "Simran Kaur",
      location: "Sector 38, Chandigarh",
      rating: 5,
      date: "2 days ago",
      item: "Cetaphil Gentle Skin Cleanser",
      comment: "Ordered at 11 AM, received by 12:15 PM via bike delivery in Sector 38. Genuine sealed bottle with fresh 2026 expiry. So glad they are online now!"
    },
    {
      id: 2,
      name: "Rohit Verma",
      location: "Phase 7, Mohali",
      rating: 5,
      date: "1 week ago",
      item: "Ensure Vanilla Drink Powder (400g)",
      comment: "I used to visit their Sector 35 counter regularly. Ordering online is even smoother. Best pricing in Tricity compared to other delivery apps."
    },
    {
      id: 3,
      name: "Priya Sharma",
      location: "Sector 20, Panchkula",
      rating: 5,
      date: "3 days ago",
      item: "Sebamed Baby Gentle Wash",
      comment: "Always skeptical about baby products online, but Getwell provided authentic batch date verification photos on WhatsApp. 100% genuine."
    },
    {
      id: 4,
      name: "Dr. Amanpreet Singh",
      location: "Sector 35-C, Chandigarh",
      rating: 5,
      date: "5 days ago",
      item: "Dot & Key Sunscreen + The Derma Co",
      comment: "As a local resident in Sector 35, Getwell Medicos has been our trusted pharmacy for over 8 years. Excellent clinical skincare curation."
    },
    {
      id: 5,
      name: "Neha Aggarwal",
      location: "VIP Road, Zirakpur",
      rating: 5,
      date: "1 week ago",
      item: "Himalaya Baby Lotion & Wipes",
      comment: "Quick dispatch and proper protective bubble wrapping. Everything arrived in pristine shape. Highly recommend for mothers!"
    },
    {
      id: 6,
      name: "Vikas Malhotra",
      location: "Sector 15, Chandigarh",
      rating: 5,
      date: "2 weeks ago",
      item: "HK Vitals Multivitamins",
      comment: "Paid through Razorpay UPI in under 10 seconds. Order tracking was sent on WhatsApp immediately. Super transparent service."
    },
    {
      id: 7,
      name: "Harleen Bhasin",
      location: "Sector 68, Mohali",
      rating: 5,
      date: "4 days ago",
      item: "Cetaphil Moisturising Cream (100g)",
      comment: "Verified the barcode on the Cetaphil official portal—completely authentic. Will definitely reorder my skincare kit from here."
    },
    {
      id: 8,
      name: "Tarun Gupta",
      location: "Sector 11, Panchkula",
      rating: 5,
      date: "6 days ago",
      item: "Sebamed Anti-Dandruff Shampoo",
      comment: "Saved me a trip to the market in heavy evening traffic. Got genuine dermatological care delivered straight to my doorstep."
    }
  ];

  // Duplicate for seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-14 bg-[#faf9f5] border-t border-[#e5e2d9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        
        {/* Trust Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-3">
          <span>★ 4.8 / 5 Rated by 1,200+ Verified Customers in Tricity</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071610] tracking-tight">
          What Chandigarh & Tricity Buyers Say
        </h2>
        
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl mx-auto">
          Hover over any card to pause scrolling and read customer experiences.
        </p>
      </div>

      {/* INFINITE HORIZONTAL ANIMATED TRACK */}
      <div className="relative w-full">
        {/* Left & Right Soft Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#faf9f5] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#faf9f5] to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused] py-2 cursor-grab active:cursor-grabbing">
          {duplicatedReviews.map((rev, index) => (
            <div
              key={`${rev.id}-${index}`}
              className="w-80 sm:w-96 bg-white p-5 rounded-2xl border border-[#e5e2d9] shadow-sm hover:shadow-md hover:border-[#476556]/40 transition-all flex flex-col justify-between shrink-0 select-none"
            >
              <div>
                {/* Header: Stars + Date + Google Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {rev.date}
                  </span>
                </div>

                {/* Purchased Item Tag */}
                <div className="mb-2.5">
                  <span className="text-[10px] font-semibold text-[#1e4e37] bg-[#eaf3ee] px-2 py-0.5 rounded-md inline-block">
                    ✓ Verified: {rev.item}
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
