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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Chandigarh",
    pincode: "160022",
    paymentMethod: "razorpay",
  });

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPlacedOrder(null);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 1),
    0,
  );
  const isFreeDelivery = subtotal >= 799;
  const deliveryFare = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 49;
  const totalAmount = subtotal + deliveryFare;

  const isTricityPincode = (pin) => {
    if (!pin) return true;
    const cleanPin = pin.trim();
    return (
      cleanPin.startsWith("160") ||
      cleanPin.startsWith("134") ||
      cleanPin.startsWith("140") ||
      cleanPin.startsWith("141")
    );
  };
  const isLocalDelivery = isTricityPincode(formData.pincode);

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }
  };

  // WhatsApp Alert Dispatch
  const sendWhatsAppNotification = async (orderPayload) => {
    try {
      await fetch("/api/send-order-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.warn("WhatsApp alert note:", err);
    }
  };

  // Save Order to Supabase (Matches exact Supabase columns)
  const saveOrderToDatabase = async (orderPayload) => {
    try {
      const fullAddress = `${orderPayload.address}, ${orderPayload.city} - ${orderPayload.pincode}`;

      const cleanOrderRow = {
        order_id: String(orderPayload.orderId),
        customer_name: String(orderPayload.customerName),
        customer_phone: String(orderPayload.customerPhone),
        delivery_address: fullAddress,
        pincode: String(orderPayload.pincode),
        city: String(orderPayload.city),
        total_amount: Number(orderPayload.totalAmount) || 0,
        payment_method: String(orderPayload.paymentMethod),
        payment_status: String(orderPayload.paymentStatus),
        order_status: "Received",
        items: Array.isArray(orderPayload.items) ? orderPayload.items : [],
      };

      console.log("Sending order to Supabase:", cleanOrderRow);

      const { data, error } = await supabase
        .from("orders")
        .insert([cleanOrderRow])
        .select();

      if (error) {
        console.error("Supabase insert error details:", error);
        alert("Supabase Order Save Error: " + error.message);
      } else {
        console.log("Order successfully inserted into Supabase:", data);
      }
      return data;
    } catch (err) {
      console.error("Supabase connection exception:", err);
      return null;
    }
  };

  // Handle Razorpay
  const handleRazorpayPayment = async (orderId) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      setErrorMsg("Razorpay Key not configured in environment variables.");
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: totalAmount * 100,
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
        color: "#059669",
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

        // Await database save first
        await saveOrderToDatabase(confirmedOrder);
        sendWhatsAppNotification(confirmedOrder);

        setPlacedOrder(confirmedOrder);
        setLoading(false);
        triggerConfetti();
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

  // Submit Order Form
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

      // Await database save first
      await saveOrderToDatabase(confirmedOrder);
      sendWhatsAppNotification(confirmedOrder);

      setPlacedOrder(confirmedOrder);
      setLoading(false);
      triggerConfetti();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              {placedOrder ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {placedOrder ? "Order Confirmed!" : "Complete Delivery Details"}
              </h3>
              <p className="text-[11px] text-slate-400">
                {placedOrder
                  ? `Order ID: #${placedOrder.orderId}`
                  : "Booth No. 13, Sec 35C Chandigarh"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (placedOrder && onClearCart) onClearCart();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {placedOrder ? (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  Thank You for Your Order!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your prescription order has been transmitted directly to our
                  Sector 35C counter.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 space-y-1 text-xs">
                <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  {placedOrder.isLocal
                    ? "Same-Day Tricity Express"
                    : "Pan-India Courier"}
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  {placedOrder.isLocal
                    ? "Packing at Booth 13, Sector 35C. Estimated delivery in 1 to 2 hours via local rider."
                    : "Dispatched via express courier. Delivery in 3 to 5 business days."}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 pb-1.5 border-b border-slate-200/60">
                  <span>Recipient:</span>
                  <span className="font-bold text-slate-900">
                    {placedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 pb-1.5 border-b border-slate-200/60">
                  <span>Delivery Address:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                    {placedOrder.address}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 pb-1.5 border-b border-slate-200/60">
                  <span>Payment:</span>
                  <span className="font-semibold text-slate-900">
                    {placedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700 font-bold">
                    ₹{placedOrder.totalAmount}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/919872633001?text=Hi%20Getwell%20Medicos,%20I%20just%20placed%20Order%20%23${placedOrder.orderId}.%20Please%20confirm%20dispatch.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
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
            <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Full Name *
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

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Mobile Number (WhatsApp) *
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

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat No., Sector or Locality, Landmark"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
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
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
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

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "razorpay" })
                    }
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      formData.paymentMethod === "razorpay"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard
                        className={`w-4 h-4 ${formData.paymentMethod === "razorpay" ? "text-emerald-700" : "text-slate-400"}`}
                      />
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                        FAST
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">
                        UPI / Cards
                      </p>
                      <p className="text-[10px] text-slate-500">
                        1-Click Razorpay
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "cod" })
                    }
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      formData.paymentMethod === "cod"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Banknote
                      className={`w-4 h-4 ${formData.paymentMethod === "cod" ? "text-emerald-700" : "text-slate-400"}`}
                    />
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">
                        Cash on Delivery
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Pay on arrival
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge</span>
                  <span>
                    {isFreeDelivery ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      `₹${deliveryFare}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-emerald-700 font-bold">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-98"
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
