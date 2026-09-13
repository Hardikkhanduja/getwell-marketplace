import React, { useState } from 'react';

export default function PrescriptionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [medicines, setMedicines] = useState('');
  const [address, setAddress] = useState('');

  const handleSendToWhatsApp = (e) => {
    e.preventDefault();

    if (!medicines.trim()) {
      alert('Please mention the medicine or product name, or specify that you are attaching a prescription.');
      return;
    }

    const message = `*PRESCRIPTION / CUSTOM MEDICINE INQUIRY*\n\n*Customer Name:* ${name || 'Not provided'}\n*Phone:* ${phone || 'Not provided'}\n*Delivery Location:* ${address || 'Chandigarh / Tricity'}\n\n*Required Medicines / Items:*\n${medicines}\n\n_(Attaching doctor prescription photo in chat if applicable)_\n\nPlease let me know availability and pricing from Sector 35C store.`;

    const whatsappUrl = `https://wa.me/919872633001?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 relative shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors"
          aria-label="Close prescription modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
            Physical Pharmacy Counter (Sector 35C)
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900">
          Order Any Medicine or Upload Rx
        </h2>
        
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Need an allopathic medicine, syrup, or product not listed on the website? Send the name or attach your doctor's prescription directly to our licensed pharmacists.
        </p>

        {/* Inquiry Form */}
        <form onSubmit={handleSendToWhatsApp} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Medicine Names / Requirements *
            </label>
            <textarea
              rows="3"
              required
              placeholder="e.g. 1. Pan-D (10 tabs)&#10;2. Shelcal 500 (15 tabs)&#10;3. Or write 'Attaching prescription photo'"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl p-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Amit Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 9872633001"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Sector / Delivery Address in Tricity
            </label>
            <input
              type="text"
              placeholder="e.g. Sector 35-C, Chandigarh"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
            />
          </div>

          {/* How It Works Guarantee */}
          <div className="bg-[#f2f7f4] border border-[#cbe3d5] rounded-xl p-3 text-[11px] text-gray-700 space-y-1">
            <p className="font-bold text-[#1f4231] flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>How it works:</span>
            </p>
            <p>1. Clicking below opens WhatsApp with your pre-filled medicine request.</p>
            <p>2. You can attach a photo of your doctor's prescription directly in the chat.</p>
            <p>3. Our pharmacist confirms total bill & dispatches via swift bike delivery!</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-4 h-4"
            />
            <span>Send Prescription / Inquiry on WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
}