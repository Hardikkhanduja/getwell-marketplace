import React, { useState } from "react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("160035");
  const [city, setCity] = useState("Chandigarh");
  const [payMethod, setPayMethod] = useState("RAZORPAY"); // 'RAZORPAY' | 'COD'
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const initiateRazorpayPayment = (orderNumber) => {
    return new Promise((resolve, reject) => {
      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";

      // If key is not yet configured, proceed smoothly in test mode
      if (!window.Razorpay || razorpayKey === "rzp_test_placeholder") {
        alert(
          `Demo Test Mode: Simulating ₹${subtotal} payment via Razorpay. Order #${orderNumber} created!`
        );
        resolve({ razorpay_payment_id: "pay_test_" + Date.now() });
        return;
      }

      const options = {
        key: razorpayKey,
        amount: subtotal * 100, // amount in paisa
        currency: "INR",
        name: "Getwell Medicos",
        description: `Order #${orderNumber} Payment`,
        image: "/favicon.svg",
        handler: function (response) {
          resolve(response);
        },
        prefill: {
          name: name,
          contact: phone,
        },
        theme: {
          color: "#071610",
        },
        modal: {
          ondismiss: function () {
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      alert("Please fill in all required delivery details.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const orderNumber = "GW-" + Math.floor(100000 + Math.random() * 900000);

      if (payMethod === "RAZORPAY") {
        await initiateRazorpayPayment(orderNumber);
      }

      const newOrder = {
        orderNumber,
        customerName: name,
        phone,
        address: `${address}, ${city} - ${pincode}`,
        items: cartItems,
        total: subtotal,
        payMethod,
        timestamp: new Date().toLocaleString("en-IN"),
      };

      setPlacedOrder(newOrder);
      if (onOrderSuccess) onOrderSuccess(newOrder);
    } catch (err) {
      alert(err.message || "Payment was not completed.");
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Order Confirmation Dispatch
  const generateWhatsAppLink = () => {
    if (!placedOrder) return "#";

    const itemsSummary = placedOrder.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} (${item.quantity}x) = ₹${
            item.price * item.quantity
          }`
      )
      .join("%0A");

    const message = `*NEW ORDER FROM GETWELL STORE*%0A%0A*Order Number:* ${placedOrder.orderNumber}%0A*Customer:* ${placedOrder.customerName}%0A*Phone:* ${placedOrder.phone}%0A*Delivery Address:* ${placedOrder.address}%0A*Payment Method:* ${placedOrder.payMethod}%0A%0A*Items Ordered:*%0A${itemsSummary}%0A%0A*Total Amount:* ₹${placedOrder.total}%0A%0A_Please confirm dispatch and rider/courier tracking._`;

    return `https://wa.me/919872633001?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 relative shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>

        {!placedOrder ? (
          /* Checkout Form */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Secure Checkout
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Delivery & Payment Details
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 mb-5">
              Booth 13, Sector 35C Chandigarh Store Dispatch
            </p>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  10-Digit Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Complete Delivery Address *
                </label>
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pincode *
                  </label>
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
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayMethod("RAZORPAY")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      payMethod === "RAZORPAY"
                        ? "border-[#071610] bg-[#071610] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-xs font-bold">UPI / Cards / Netbanking</p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Fast 1-Click Razorpay
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod("COD")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      payMethod === "COD"
                        ? "border-[#071610] bg-[#071610] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-xs font-bold">Cash on Delivery</p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Pay on doorstep arrival
                    </p>
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
                    {subtotal >= 799 ? "FREE" : "Calculated at actual distance"}
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
                className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing Payment...</span>
                ) : (
                  <span>
                    Confirm & Place Order (₹{subtotal})
                  </span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Order Placed Success View */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-2xl flex items-center justify-center mx-auto">
              ✓
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Order Received Successfully!
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Order ID:{" "}
                <span className="font-bold text-gray-800">
                  #{placedOrder.orderNumber}
                </span>
              </p>
            </div>

            <div className="bg-[#faf9f5] border border-gray-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <p>
                <strong>Customer:</strong> {placedOrder.customerName} (
                {placedOrder.phone})
              </p>
              <p>
                <strong>Deliver to:</strong> {placedOrder.address}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{placedOrder.total} (
                {placedOrder.payMethod})
              </p>
              <p className="text-emerald-800 font-semibold pt-1 border-t border-gray-200">
                ● Packaging at Booth 13, Sector 35C Counter
              </p>
            </div>

            {/* Official WhatsApp Dispatch Action */}
            <div className="pt-2 space-y-2">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  className="w-4 h-4"
                />
                <span>Send Order Receipt to WhatsApp Store</span>
              </a>

              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Close & Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
