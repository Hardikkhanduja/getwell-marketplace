import React from 'react';

export default function PolicyModal({ policyType, onClose }) {
  if (!policyType) return null;

  const policies = {
    terms: {
      title: "Terms & Conditions",
      content: `Welcome to Getwell Medicos. By accessing this website and placing orders, you agree to our terms. All products listed in our online catalog are authentic non-prescription skincare, wellness, and baby care items sourced directly from licensed pharmaceutical distributors. Prescription (Rx) allopathic medicines are dispensed strictly upon licensed pharmacist verification at our physical counter in Sector 35C, Chandigarh or via authorized WhatsApp verification.`
    },
    privacy: {
      title: "Privacy Policy",
      content: `Getwell Medicos values your privacy. We collect customer names, phone numbers, and delivery addresses solely to process, verify, and dispatch orders. Payment data is encrypted and securely processed by Razorpay (PCI-DSS compliant). We do not sell, rent, or share customer data with third-party advertising companies.`
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      content: `• Local Chandigarh, Mohali & Panchkula: Orders are packed at our Sector 35C store and dispatched via local bike parcel riders within 1 to 3 hours.\n• All India Delivery: Dispatched via Postal Speed Post / Courier within 24 hours (estimated delivery 3 to 5 business days).\n• Free Shipping: Free standard delivery applies to all orders above ₹799. Delivery for orders below ₹799 is calculated transparently based on actual distance or parcel weight.`
    },
    refunds: {
      title: "Cancellation & Refund Policy",
      content: `• Cancellations: Orders may be cancelled prior to dispatch by calling our helpline (+91 9872633001) or messaging our WhatsApp desk.\n• Returns & Replacements: We offer a 7-day replacement or refund policy for items that arrive damaged, defective, or incorrect. Unopened items in original tamper-proof packaging are eligible for return. Approved refunds are credited back to the original payment source within 3 to 5 working days.`
    },
    contact: {
      title: "Contact Us & Business Details",
      content: `• Legal Firm: Getwell Medicos\n• Physical Store: Booth No. 13, Sub. City Center, Sector 35-C, Chandigarh, 160022\n• Helpline / WhatsApp: +91 9872633001\n• Working Hours: Monday to Sunday, 9:00 AM – 09:00 PM (All 7 Days)`
    }
  };

  const current = policies[policyType] || policies.terms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 relative shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors"
          aria-label="Close policy modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
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