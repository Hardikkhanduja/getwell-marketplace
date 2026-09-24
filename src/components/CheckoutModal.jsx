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
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabase";

// Helper to dynamically load the official Razorpay SDK script if missing
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutModal({
  isOpen,
  onClose,
  cart = [],
  cartItems = [],
  onOrderPlaced,
}) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Chandigarh",
    pincode: "160022",
    paymentMethod: "razorpay", // 'razorpay' | 'cod'
  });

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Support both cart and cartItems props
  const items = cartItems.length > 0 ? cartItems : cart;

  // Pricing calculations
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.price || item.selling_price) || 0) *
        (Number(item.quantity) || 1),
    0,
  );
  const isFreeDelivery = subtotal >= 799;
  const deliveryFare = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 49;
  const totalAmount = subtotal + deliveryFare;

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setPlacedOrder(null);
      setErrorMsg("");
      loadRazorpayScript(); // Preload script in background
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        body: JSON.stringify({ order: orderPayload }),
      });
    } catch (err) {
      console.warn("WhatsApp alert dispatch background note:", err);
    }
  };

  // Save Order to Supabase (compatible with all column variations)
  const saveOrderToDatabase = async (orderPayload) => {
    if (!supabase) return null;
    try {
      const cleanPhone = orderPayload.phone || orderPayload.customerPhone;
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            order_number: orderPayload.orderNumber || orderPayload.orderId,
            customer_name: orderPayload.customerName,
            customer_phone: cleanPhone,
            phone: cleanPhone,
            delivery_address: `${orderPayload.address}, ${orderPayload.city} - ${orderPayload.pincode}`,
            address: orderPayload.address,
            pincode: orderPayload.pincode,
            city: orderPayload.city,
            total_amount: orderPayload.totalAmount,
            total: orderPayload.totalAmount,
            payment_method: orderPayload.paymentMethod,
            payment_status: orderPayload.paymentStatus,
            payment_id: orderPayload.paymentId || "",
            order_status: "RECEIVED",
            status: "PENDING_DISPATCH",
            items: orderPayload.items,
          },
        ])
        .select();

      if (error) {
        console.warn("Supabase order insert note:", error.message);
      }
      return data;
    } catch (err) {
      console.warn("Supabase order error:", err);
      return null;
    }
  };

  // Complete Order Post-Payment / Post-COD
  const finalizeOrder = (confirmedOrder) => {
    setPlacedOrder(confirmedOrder);
    setLoading(false);
    triggerConfetti();

    // Clear cart
    if (onOrderPlaced) onOrderPlaced();

    // Background notifications & database recording
    saveOrderToDatabase(confirmedOrder);
    sendWhatsAppNotification(confirmedOrder);
  };

  // Razorpay Checkout Trigger
  const handleRazorpayPayment = async (orderId) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      setErrorMsg(
        "Unable to load Razorpay payment gateway. Please check your internet connection.",
      );
      setLoading(false);
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      setErrorMsg(
        "Razorpay Key not found. Please add VITE_RAZORPAY_KEY_ID in your .env file or Vercel settings.",
      );
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: Math.round(totalAmount * 100), // In Paise (e.g. ₹100 = 10000 paise)
      currency: "INR",
      name: "Getwell Medicos",
      description: `Order #${orderId} - Pharmacy Counter Dispensing`,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200",
      prefill: {
        name: formData.name,
        contact: formData.phone,
      },
      theme: {
        color: "#059669", // Emerald-600
      },
      handler: function (response) {
        const confirmedOrder = {
          orderId,
          orderNumber: orderId,
          customerName: formData.name,
          customerPhone: formData.phone,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          items,
          totalAmount,
          total: totalAmount,
          paymentMethod: "Prepaid (UPI / Card / Netbanking)",
          payMethod: "Prepaid (UPI / Card / Netbanking)",
          paymentStatus: "Paid",
          paymentId: response.razorpay_payment_id,
          createdAt: new Date().toISOString(),
          isLocal: isLocalDelivery,
        };

        finalizeOrder(confirmedOrder);
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
        setErrorMsg(
          `Payment Failed: ${response.error?.description || "Transaction declined"}`,
        );
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      setErrorMsg("Could not open Razorpay window. Please try again.");
      setLoading(false);
    }
  };

  // Submit Order Handler
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setErrorMsg(
        "Please enter your name, 10-digit phone number, and delivery address.",
      );
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
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
        orderNumber: orderId,
        customerName: formData.name,
        customerPhone: formData.phone,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        items,
        totalAmount,
        total: totalAmount,
        paymentMethod: "Cash on Delivery (COD)",
        payMethod: "Cash on Delivery (COD)",
        paymentStatus: "Pending (Pay on Arrival)",
        paymentId: "",
        createdAt: new Date().toISOString(),
        isLocal: isLocalDelivery,
      };

      finalizeOrder(confirmedOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-2xl">
              {placedOrder ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                {placedOrder ? "Order Confirmed!" : "Delivery & Payment"}
              </h3>
              <p className="text-xs text-slate-400">
                {placedOrder
                  ? `Order #${placedOrder.orderId}`
                  : "Getwell Medicos • Sector 35C"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* CONFIRMATION SCREEN */}
          {placedOrder ? (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Thank You for Your Order!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your order has been transmitted directly to our pharmacy
                  counter at Sector 35C Chandigarh.
                </p>
              </div>

              {/* Delivery ETA Card */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  {placedOrder.isLocal
                    ? "90-Min Same-Day Tricity Dispatch"
                    : "Pan-India Courier Dispatch"}
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Our pharmacists are packaging your verified batch. You will
                  receive real-time WhatsApp updates on dispatch.
                </p>
              </div>

              {/* Order Summary Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">
                    #{placedOrder.orderId}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Customer:</span>
                  <span className="font-semibold text-slate-900">
                    {placedOrder.customerName} ({placedOrder.customerPhone})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Address:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                    {placedOrder.address}, {placedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Mode:</span>
                  <span className="font-semibold text-emerald-700">
                    {placedOrder.paymentMethod}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Total Paid / Payable:</span>
                  <span className="font-mono text-emerald-800 text-base">
                    ₹{placedOrder.totalAmount}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Contact Information
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9872633001"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  2. Delivery Address
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    House / Flat / Street / Sector *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. House #142, Sector 35-C"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  3. Select Payment Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Razorpay Online */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      formData.paymentMethod === "razorpay"
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/10"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: "razorpay" })
                      }
                      className="accent-emerald-600"
                    />
                    <div>
                      <p className="text-xs font-bold flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        UPI / Cards / Netbanking
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Google Pay, PhonePe, Paytm, Cards
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      formData.paymentMethod === "cod"
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/10"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: "cod" })
                      }
                      className="accent-emerald-600"
                    />
                    <div>
                      <p className="text-xs font-bold flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5 text-slate-700" />
                        Cash on Delivery
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Pay in cash upon doorstep delivery
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Total & CTA */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Subtotal ({items.length} items):</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Delivery Fare:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {isFreeDelivery ? "FREE" : "₹49"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable:</span>
                  <span className="text-base font-mono text-emerald-800">
                    ₹{totalAmount}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Opening Payment Gateway...</span>
                  ) : (
                    <>
                      <span>
                        {formData.paymentMethod === "razorpay"
                          ? `Pay ₹${totalAmount} via UPI / Cards`
                          : `Confirm COD Order (₹${totalAmount})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
