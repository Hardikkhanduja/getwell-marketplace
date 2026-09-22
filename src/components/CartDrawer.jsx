// src/components/CartDrawer.jsx
import React from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const MIN_ORDER_VALUE = 199; // ₹199 Minimum for home delivery
const FREE_SHIPPING_THRESHOLD = 799; // ₹799 for free delivery

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

  const safeItems = Array.isArray(cartItems) ? cartItems : [];

  const subtotal = safeItems.reduce(
    (sum, item) =>
      sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 1),
    0,
  );
  const totalMrp = safeItems.reduce(
    (sum, item) =>
      sum +
      (Number(item?.mrp || item?.price) || 0) * (Number(item?.quantity) || 1),
    0,
  );
  const totalSavings = Math.max(0, totalMrp - subtotal);
  const totalQuantity = safeItems.reduce(
    (acc, item) => acc + (Number(item?.quantity) || 1),
    0,
  );

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  const isMinOrderMet = subtotal >= MIN_ORDER_VALUE;
  const minOrderShortage = Math.max(0, MIN_ORDER_VALUE - subtotal);

  const getProductImage = (item) => {
    if (Array.isArray(item?.image_urls) && item.image_urls.length > 0) {
      return item.image_urls[0];
    }
    if (typeof item?.image_url === "string" && item.image_url.trim()) {
      return item.image_url.trim();
    }
    if (typeof item?.image === "string" && item.image.trim()) {
      return item.image.trim();
    }
    return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dim Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity cursor-pointer animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 h-full">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden border-l border-slate-100 animate-slideLeft">
          {/* 1. FIXED TOP HEADER (NEVER CLIPS) */}
          <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold border border-emerald-100">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  Medicine Bag
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"} •
                  Dispatch from Sec 35C
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. FIXED FREE DELIVERY GOAL BAR */}
          {safeItems.length > 0 && (
            <div className="flex-shrink-0 bg-slate-50 px-6 py-2.5 border-b border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5 truncate">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> FREE Express Delivery
                      Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add{" "}
                      <strong className="text-slate-900">
                        ₹{shippingRemaining}
                      </strong>{" "}
                      more for Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  {Math.round(freeShippingProgress)}%
                </span>
              </div>

              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. SCROLLABLE MIDDLE CART ITEMS ONLY */}
          <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-slate-100">
            {safeItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Your bag is empty
                </h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Explore genuine skincare, doctor prescriptions, and baby care
                  essentials from our Sector 35C counter.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              safeItems.map((item) => {
                const itemName =
                  item?.name || item?.title || "Pharmacy Product";
                const itemBrand =
                  item?.brand || item?.brand_name || "Pharma Grade";
                const itemPrice = Number(item?.price) || 0;
                const itemMrp = Number(item?.mrp || item?.price) || itemPrice;
                const itemQty = Number(item?.quantity) || 1;

                return (
                  <div key={item.id} className="py-4 flex gap-3.5 items-center">
                    {/* Thumbnail Box */}
                    <div className="w-16 h-16 rounded-xl border border-slate-200/80 bg-slate-50 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={getProductImage(item)}
                        alt={itemName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
                        {itemName}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {itemBrand} {item.unit ? `• ${item.unit}` : ""}
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-xs font-extrabold text-emerald-700">
                          ₹{itemPrice}
                        </span>
                        {itemMrp > itemPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{itemMrp}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Trash */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 shadow-2xs">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, Math.max(1, itemQty - 1))
                          }
                          disabled={itemQty <= 1}
                          className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 min-w-[20px] text-center">
                          {itemQty}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, itemQty + 1)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 4. FIXED BILL SUMMARY & CHECKOUT (PINNED AT BOTTOM) */}
          {safeItems.length > 0 && (
            <div className="flex-shrink-0 border-t border-slate-100 bg-white p-5 space-y-3.5 shadow-lg">
              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Item Total (MRP)</span>
                  <span className="font-mono">₹{totalMrp}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Direct Pharmacy Discount</span>
                    <span className="font-mono">-₹{totalSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Estimate</span>
                  <span>
                    {isFreeShipping ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      "Calculated at checkout"
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className="text-emerald-700 font-bold text-base">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              {/* Clean Minimum Order Notice */}
              {!isMinOrderMet ? (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-bold text-amber-950">
                      Minimum Delivery: ₹199
                    </p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Add items worth <strong>₹{minOrderShortage}</strong> more
                      to order for doorstep dispatch.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Inspected & verified by on-duty pharmacist</span>
                </div>
              )}

              {/* Checkout CTA */}
              <button
                disabled={!isMinOrderMet}
                onClick={onProceedToCheckout}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  isMinOrderMet
                    ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer active:scale-98 shadow-slate-900/10"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                }`}
              >
                <span>
                  {isMinOrderMet
                    ? "Proceed to Checkout"
                    : `Add ₹${minOrderShortage} more to Order`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
