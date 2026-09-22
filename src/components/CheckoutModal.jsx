// src/components/CheckoutModal.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabase";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  onClearCart,
}) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Chandigarh",
    pincode: "160022",
    paymentMethod: "razorpay", // 'razorpay' or 'cod'
  });

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Reset placedOrder when modal opens fresh
  useEffect(() => {
    if (isOpen) {
      setPlacedOrder(null);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0,
  );
  const isFreeDelivery = subtotal >= 799;
  const deliveryFare = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 49;
  const totalAmount = subtotal + deliveryFare;

  // Pincode detection (Tricity vs National)
  const isTricityPincode = (pin) => {
    if (!pin) return true;
    const cleanPin = pin.trim();
    return (
      cleanPin.startsWith("160") || // Chandigarh
      cleanPin.startsWith("134") || // Panchkula / Pinjore
      cleanPin.startsWith("140") || // Mohali / Zirakpur / Kharar
      cleanPin.startsWith("141")
    );
  };
  const isLocalDelivery = isTricityPincode(formData.pincode);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  // Dispatch dual WhatsApp alert to Father & Son
  const sendWhatsAppNotification = async (orderPayload) => {
    try {
      await fetch("/api/send-order-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.warn("WhatsApp alert dispatch background note:", err);
    }
  };

  // Save Order to Supabase with all column aliases
  const saveOrderToDatabase = async (orderPayload) => {
    try {
      const fullAddress = `${orderPayload.address}, ${orderPayload.city} - ${orderPayload.pincode}`;

      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            order_id: orderPayload.orderId,
            customer_name: orderPayload.customerName,
            name: orderPayload.customerName,
            customer_phone: orderPayload.customerPhone,
            phone: orderPayload.customerPhone,
            delivery_address: fullAddress,
            address: fullAddress,
            pincode: orderPayload.pincode,
            city: orderPayload.city,
            total_amount: Number(orderPayload.totalAmount) || 0,
            total: Number(orderPayload.totalAmount) || 0,
            payment_method: orderPayload.paymentMethod,
            payment_status: orderPayload.paymentStatus,
            order_status: "Received",
            status: "Received",
            items: orderPayload.items || [],
          },
        ])
        .select();

      if (error) {
        console.error("Supabase order insert error:", error);
      } else {
        console.log("Order successfully saved to Supabase:", data);
      }
      return data;
    } catch (err) {
      console.error("Supabase connection error:", err);
      return null;
    }
  };

  // Handle Razorpay Checkout
  const handleRazorpayPayment = async (orderId) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      setErrorMsg("Razorpay Key not configured in environment variables.");
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: totalAmount * 100, // in paise
      currency: "INR",
      name: "Getwell Medicos",
      description: `Order #${orderId} - Pharmacy Dispensing`,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200",
      prefill: {
        name: formData.name,
        contact: formData.phone,
      },
      theme: {
        color: "#059669", // emerald-600
      },
      handler: async function (response) {
        const confirmedOrder = {
          orderId,
          customerName: formData.name,
          customerPhone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          items: cartItems,
          totalAmount,
          paymentMethod: "Prepaid (UPI / Card / NetBanking)",
          paymentStatus: "Paid",
          razorpayPaymentId: response.razorpay_payment_id,
          createdAt: new Date().toISOString(),
          isLocal: isLocalDelivery,
        };

        // 1. Immediately show confirmation screen
        setPlacedOrder(confirmedOrder);
        setLoading(false);
        triggerConfetti();

        // 2. Non-blocking background save & WhatsApp alert
        saveOrderToDatabase(confirmedOrder);
        sendWhatsAppNotification(confirmedOrder);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setErrorMsg(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay invocation error:", err);
      setErrorMsg("Could not open Razorpay checkout window.");
      setLoading(false);
    }
  };

  // Form Submit Handler
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setErrorMsg(
        "Please fill in your name, phone number, and complete delivery address.",
      );
      return;
    }

    if (formData.phone.trim().replace(/\D/g, "").length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    const orderId = "GWM-" + Math.floor(100000 + Math.random() * 900000);

    if (formData.paymentMethod === "razorpay") {
      await handleRazorpayPayment(orderId);
    } else {
      // Cash on Delivery
      const confirmedOrder = {
        orderId,
        customerName: formData.name,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        items: cartItems,
        totalAmount,
        paymentMethod: "Cash on Delivery (COD)",
        paymentStatus: "Pending (Pay on Arrival)",
        createdAt: new Date().toISOString(),
        isLocal: isLocalDelivery,
      };

      // 1. Immediately show confirmation screen
      setPlacedOrder(confirmedOrder);
      setLoading(false);
      triggerConfetti();

      // 2. Background database save & WhatsApp dispatch
      saveOrderToDatabase(confirmedOrder);
      sendWhatsAppNotification(confirmedOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* ================= FIXED STICKY HEADER (ALWAYS VISIBLE WITH CLOSE BUTTON) ================= */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              {placedOrder ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                {placedOrder ? "Order Confirmed!" : "Complete Delivery Details"}
              </h3>
              <p className="text-xs text-slate-500">
                {placedOrder
                  ? `Order ID: #${placedOrder.orderId}`
                  : "Dispatched from Booth 13, Sec 35C"}
              </p>
            </div>
          </div>

          {/* Permanently Visible Close Button */}
          <button
            type="button"
            onClick={() => {
              if (placedOrder && onClearCart) {
                onClearCart();
              }
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= SCROLLABLE CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* VIEW 1: ORDER CONFIRMATION SCREEN */}
          {placedOrder ? (
            <div className="space-y-6 py-2">
              {/* Success Badge */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  Thank You for Your Order!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your order has been transmitted directly to our pharmacy
                  counter at Sector 35C.
                </p>
              </div>

              {/* Delivery Timeline Card */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  {placedOrder.isLocal
                    ? "Same-Day Tricity Dispatch"
                    : "Pan-India Courier Dispatch"}
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {placedOrder.isLocal ? (
                    <>
                      Our pharmacist is packing your items at{" "}
                      <strong>Booth No. 13, Sector 35C</strong>. Estimated
                      delivery is within <strong>1 to 2 hours</strong> via local
                      rider.
                    </>
                  ) : (
                    <>
                      Your package will be securely shipped via our express
                      courier partner. Estimated delivery is{" "}
                      <strong>3 to 5 business days</strong> with tracking
                      provided on WhatsApp.
                    </>
                  )}
                </p>
              </div>

              {/* Order Summary Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                  <span>Recipient:</span>
                  <span className="font-semibold text-slate-900">
                    {placedOrder.customerName} ({placedOrder.customerPhone})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                  <span>Delivery Address:</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[200px] truncate">
                    {placedOrder.address}, {placedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-slate-900">
                    {placedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1">
                  <span>Total Paid / Payable:</span>
                  <span className="text-emerald-700 font-bold">
                    ₹{placedOrder.totalAmount}
                  </span>
                </div>
              </div>

              {/* 1-Tap WhatsApp Support Button */}
              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/919872633001?text=Hi%20Getwell%20Medicos,%20I%20just%20placed%20Order%20%23${placedOrder.orderId}.%20Please%20confirm%20dispatch.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Chat with Pharmacist on WhatsApp
                </a>

                <button
                  onClick={() => {
                    if (onClearCart) onClearCart();
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* VIEW 2: CHECKOUT FORM */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 transition"
                />
              </div>

              {/* WhatsApp Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number
                  (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9872633001"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 transition"
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Complete
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House / Flat No., Sector or Locality, Landmark"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 transition resize-none"
                />
              </div>

              {/* City & Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Delivery Estimation Pill */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600">
                  {isLocalDelivery ? (
                    <strong className="text-emerald-700">
                      Tricity Express: 1–2 hours local bike rider
                    </strong>
                  ) : (
                    <strong className="text-slate-800">
                      Pan-India Courier: 3–5 business days
                    </strong>
                  )}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Razorpay UPI/Cards */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "razorpay" })
                    }
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      formData.paymentMethod === "razorpay"
                        ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard
                        className={`w-4 h-4 ${formData.paymentMethod === "razorpay" ? "text-emerald-600" : "text-slate-400"}`}
                      />
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        FAST
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">
                        UPI / Cards / Netbanking
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Fast 1-Click Razorpay
                      </p>
                    </div>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "cod" })
                    }
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      formData.paymentMethod === "cod"
                        ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Banknote
                      className={`w-4 h-4 ${formData.paymentMethod === "cod" ? "text-emerald-600" : "text-slate-400"}`}
                    />
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">
                        Cash on Delivery
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Pay on doorstep arrival
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Pricing Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    Items Total (
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
                  </span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fare</span>
                  <span>
                    {isFreeDelivery ? (
                      <strong className="text-emerald-600">FREE</strong>
                    ) : (
                      `₹${deliveryFare}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1.5 border-t border-slate-200">
                  <span>Payable Total</span>
                  <span className="text-emerald-700 font-bold">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Place Order (₹{totalAmount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
