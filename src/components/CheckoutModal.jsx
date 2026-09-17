import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

// Helper: Check if address is in Chandigarh/Tricity
const isLocalTricity = (pincode, city) => {
  const cleanPin = (pincode || '').trim();
  const cleanCity = (city || '').toLowerCase();
  const isTricityPin = cleanPin.startsWith('160') || cleanPin.startsWith('134') || cleanPin.startsWith('140');
  const isTricityCity = ['chandigarh', 'mohali', 'panchkula', 'zirakpur', 'kharar'].some((c) => cleanCity.includes(c));
  return isTricityPin || isTricityCity;
};

export default function CheckoutModal({ isOpen, onClose, cartItems, onClearCart }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chandigarh');
  const [pincode, setPincode] = useState('160022');
  const [payMethod, setPayMethod] = useState('RAZORPAY'); // 'RAZORPAY' or 'COD'
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isTricity = isLocalTricity(pincode, city);
  const deliveryNote = subtotal >= 799 
    ? 'FREE (Orders above ₹799)' 
    : (isTricity ? 'Local bike rider fare' : 'Standard courier weight fare');

  // Trigger background WhatsApp alert (non-blocking)
  const triggerAutoWhatsAppAlert = (orderData) => {
    try {
      fetch('/api/send-order-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderData }),
      }).catch((err) => console.warn('WhatsApp alert fetch failed:', err));
    } catch (err) {
      console.warn('Background alert error:', err);
    }
  };

  // Save order to Supabase (non-blocking)
  const saveOrderToSupabase = async (orderData) => {
    if (!supabase) return;
    try {
      await supabase.from('orders').insert([
        {
          order_number: String(orderData.orderNumber),
          customer_name: orderData.customerName,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          pincode: orderData.pincode,
          payment_method: orderData.payMethod,
          payment_id: orderData.paymentId || null,
          items: orderData.items,
          subtotal: orderData.subtotal,
          delivery_fare: orderData.deliveryFare,
          total_amount: orderData.total,
          status: 'PENDING_DISPATCH'
        }
      ]);
    } catch (err) {
      console.error('Supabase order insert error:', err);
    }
  };

  // Safe Confetti
  const fireConfetti = () => {
    try {
      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e) {}
  };

  const handleOnlinePayment = (orderData) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

    if (!window.Razorpay) {
      alert('Razorpay gateway is initializing. Proceeding with store counter verification.');
      saveOrderToSupabase(orderData);
      triggerAutoWhatsAppAlert(orderData);
      if (onClearCart) onClearCart();
      setPlacedOrder(orderData);
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: subtotal * 100, // INR in paise
      currency: 'INR',
      name: 'Getwell Medicos',
      description: `Order #${orderData.orderNumber}`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      handler: function (response) {
        const completedOrder = {
          ...orderData,
          paymentId: response.razorpay_payment_id,
          payMethod: 'RAZORPAY (Paid Online)'
        };
        // 1. Immediately show confirmation screen
        setPlacedOrder(completedOrder);
        setLoading(false);
        fireConfetti();
        if (onClearCart) onClearCart();

        // 2. Perform background database & WhatsApp sync
        saveOrderToSupabase(completedOrder);
        triggerAutoWhatsAppAlert(completedOrder);
      },
      prefill: {
        name: name,
        contact: phone,
      },
      theme: {
        color: '#071610',
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        alert('Payment failed: ' + resp.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay invocation error:', err);
      saveOrderToSupabase(orderData);
      triggerAutoWhatsAppAlert(orderData);
      if (onClearCart) onClearCart();
      setPlacedOrder(orderData);
      setLoading(false);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    const orderData = {
      orderNumber: Math.floor(100000 + Math.random() * 900000),
      customerName: name,
      phone,
      address,
      city,
      pincode,
      payMethod: payMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Razorpay UPI/Card',
      paymentId: null,
      items: cartItems,
      subtotal: subtotal,
      deliveryFare: deliveryNote,
      total: subtotal,
      date: new Date().toISOString()
    };

    if (payMethod === 'RAZORPAY') {
      handleOnlinePayment(orderData);
    } else {
      // 1. Immediately show confirmation screen for COD
      setPlacedOrder(orderData);
      setLoading(false);
      fireConfetti();
      if (onClearCart) onClearCart();

      // 2. Background database & WhatsApp dispatch
      saveOrderToSupabase(orderData);
      triggerAutoWhatsAppAlert(orderData);
    }
  };

  const handleModalClose = () => {
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 relative shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors z-10"
          aria-label="Close checkout"
        >
          ✕
        </button>

        {!placedOrder ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                Physical Store Dispatch • Sector 35C
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Complete Delivery Details</h2>
            <p className="text-xs text-gray-500 mt-1">
              Deliveries across Chandigarh, Mohali &amp; Panchkula dispatched same-day via local bike riders.
            </p>

            <form onSubmit={handleSubmitOrder} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9872633001"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Complete Delivery Address *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="House / Flat No., Sector or Locality, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayMethod('RAZORPAY')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      payMethod === 'RAZORPAY'
                        ? 'border-[#071610] bg-[#071610] text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-xs font-bold">UPI / Cards / Netbanking</p>
                    <p className="text-[10px] opacity-80 mt-0.5">Fast 1-Click Razorpay</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('COD')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      payMethod === 'COD'
                        ? 'border-[#071610] bg-[#071610] text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-xs font-bold">Cash on Delivery</p>
                    <p className="text-[10px] opacity-80 mt-0.5">Pay on doorstep arrival</p>
                  </button>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-[#faf9f5] border border-gray-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total ({cartItems.length} products)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fare</span>
                  <span className="text-emerald-800 font-bold">{deliveryNote}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                  <span>Payable Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : `Confirm & Place Order (₹${subtotal})`}
              </button>
            </form>
          </div>
        ) : (
          /* High-Converting Order Confirmation Screen */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-9 h-9 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                Order Received • Sector 35C Counter
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Thank You, {placedOrder.customerName}!</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Your order <span className="font-bold text-gray-800">#{placedOrder.orderNumber}</span> has been confirmed.
              </p>
            </div>

            {/* Smart Delivery Timeline Box */}
            <div className="bg-[#f0f7f3] border border-[#cbe3d5] p-3.5 rounded-2xl text-left flex items-start gap-3 text-xs text-gray-800">
              <span className="text-xl">
                {isLocalTricity(placedOrder.pincode, placedOrder.city) ? '🚴' : '📦'}
              </span>
              <div>
                <p className="font-bold text-[#1f4231]">
                  {isLocalTricity(placedOrder.pincode, placedOrder.city)
                    ? 'Same-Day Tricity Bike Dispatch'
                    : 'All-India Courier / Speed Post Dispatch'}
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                  {isLocalTricity(placedOrder.pincode, placedOrder.city)
                    ? 'Our pharmacist is packing your items at Booth No. 13, Sector 35C. Estimated delivery is within 1 to 2 hours.'
                    : 'Your order is being packaged at our Sector 35C counter. It will be dispatched via courier within 24 hours (Estimated delivery: 3 to 5 business days).'}
                </p>
              </div>
            </div>

            {/* Order Details Receipt Box */}
            <div className="bg-[#faf9f5] border border-gray-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500">Delivery Address:</span>
                <span className="font-semibold text-gray-900 text-right max-w-[65%] truncate">
                  {placedOrder.address}, {placedOrder.city} ({placedOrder.pincode})
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-bold text-emerald-800">{placedOrder.payMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-base font-extrabold text-[#071610]">₹{placedOrder.total}</span>
              </div>
            </div>

            {/* Support Note */}
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>📱 An automated order receipt has been sent to your WhatsApp number.</p>
              <p>
                Need urgent help? Call our counter:{' '}
                <a href="tel:+919872633001" className="font-bold text-[#071610] underline">
                  +91 9872633001
                </a>
              </p>
            </div>

            <button
              onClick={handleModalClose}
              className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-md mt-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
