import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess }) {
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
  const deliveryNote = subtotal >= 799 ? 'FREE (Orders above ₹799)' : 'Calculated at actual distance';

  // Helper: Silently trigger the automated serverless WhatsApp notification
  const triggerAutoWhatsAppAlert = async (orderData) => {
    try {
      await fetch('/api/send-order-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderData }),
      });
    } catch (err) {
      console.warn('Background WhatsApp alert failed:', err);
    }
  };

  // Helper: Save order into Supabase
  const saveOrderToSupabase = async (orderData) => {
    if (!supabase) return orderData;

    try {
      await supabase
        .from('orders')
        .insert([
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
    return orderData;
  };

  const handleOnlinePayment = async (orderData) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

    if (!window.Razorpay) {
      alert('Razorpay gateway is initializing. Proceeding via direct counter confirmation.');
      await saveOrderToSupabase(orderData);
      triggerAutoWhatsAppAlert(orderData);
      setPlacedOrder(orderData);
      onOrderSuccess();
      return;
    }

    const options = {
      key: razorpayKey,
      amount: subtotal * 100, // INR in paise
      currency: 'INR',
      name: 'Getwell Medicos',
      description: `Order #${orderData.orderNumber}`,
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      handler: async function (response) {
        const completedOrder = {
          ...orderData,
          paymentId: response.razorpay_payment_id,
          payMethod: 'RAZORPAY (Paid Online)'
        };
        await saveOrderToSupabase(completedOrder);
        triggerAutoWhatsAppAlert(completedOrder); // Auto sends to both WhatsApp numbers
        setPlacedOrder(completedOrder);
        onOrderSuccess();
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
      setPlacedOrder(orderData);
      onOrderSuccess();
    }
  };

  const handleSubmitOrder = async (e) => {
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
      await handleOnlinePayment(orderData);
    } else {
      await saveOrderToSupabase(orderData);
      triggerAutoWhatsAppAlert(orderData); // Automatically alerts both of you in the background
      setTimeout(() => {
        setPlacedOrder(orderData);
        setLoading(false);
        onOrderSuccess();
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 relative shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors"
          aria-label="Close checkout"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
                  <span className="text-emerald-800 font-bold">
                    {subtotal >= 799 ? 'FREE' : 'Calculated at actual distance'}
                  </span>
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
                {loading ? (
                  <span>Confirming Order...</span>
                ) : (
                  <span>Place Order (₹{subtotal})</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Clean Order Placed Success View (No manual WhatsApp click required) */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Placed Successfully!</h2>
              <p className="text-xs text-gray-500 mt-1">
                Order ID: <span className="font-bold text-gray-800">#{placedOrder.orderNumber}</span>
              </p>
            </div>

            <div className="bg-[#faf9f5] border border-gray-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <p><strong>Customer:</strong> {placedOrder.customerName} ({placedOrder.phone})</p>
              <p><strong>Deliver to:</strong> {placedOrder.address}, {placedOrder.city}</p>
              <p><strong>Total Amount:</strong> ₹{placedOrder.total} ({placedOrder.payMethod})</p>
              <p className="text-emerald-800 font-semibold pt-1 border-t border-gray-200 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Order received at our Sector 35C counter. Packaging now!</span>
              </p>
            </div>

            <p className="text-[11px] text-gray-500">
              Our pharmacist will reach out to you on WhatsApp/Phone for delivery dispatch confirmation.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md mt-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
