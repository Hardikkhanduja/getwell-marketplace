import React from 'react';

export default function PolicyModal({ policyType, onClose }) {
  if (!policyType) return null;

  const policies = {
    terms: {
      title: "Terms & Conditions",
      content: `Welcome to Getwell Medicos. By using our website and placing orders, you agree to our terms. All products listed on this website are genuine non-prescription wellness, clinical skincare, and OTC items directly sourced from authorized pharmaceutical distributors. Prescription (Rx) allopathic medicines are dispensed strictly at our physical pharmacy counter in Sector 35C, Chandigarh or via authorized verification.`
    },
    privacy: {
      title: "Privacy Policy",
      content: `Getwell Medicos values your privacy. We collect customer names, contact numbers, and delivery addresses solely to fulfill and dispatch orders. Payment information is securely processed by Razorpay using bank-grade encryption. We never sell or share your personal data with third-party marketing companies.`
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      content: `• Local Chandigarh, Mohali & Panchkula: Dispatched via local bike parcel riders within 1 to 3 hours of order confirmation.
• Domestic All India: Dispatched via Speed Post / Courier within 24 hours (estimated delivery 3–5 business days).
• Free Shipping: Applicable on all orders above ₹799. Delivery fee for orders below ₹799 is charged at actual distance/weight.`
    },
    refunds: {
      title: "Cancellation & Refund Policy",
      content: `• Cancellations: Orders can be cancelled before dispatch by contacting us on WhatsApp or Phone (+91 9872633001).
• Returns & Refunds: We offer a 7-day replacement or refund policy for items received in damaged, leaked, or incorrect condition. To claim a refund, please send photos of the package to our WhatsApp support. Approved refunds are credited to the original payment source within 3–5 business days.`
    },
    contact: {
      title: "Contact Us & Business Details",
      content: `• Registered Firm: Getwell Medicos
• Operating Store: Booth No. 13, Sub. City Center, Sector 35-C, Chandigarh, 160022
• Helpline: +91 9872633001
• Store Hours: Monday to Sunday, 9:00 AM – 9:00 PM`
    }
  };

  const current = policies[policyType] || policies.terms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 relative shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-3">{current.title}</h3>
        <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-[#faf9f5] p-4 rounded-xl border border-gray-200">
          {current.content}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full bg-[#071610] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#1c382b] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
