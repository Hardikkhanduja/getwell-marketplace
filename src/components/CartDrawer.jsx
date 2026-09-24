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
} from "lucide-react";

const MIN_ORDER_VALUE = 199; // ₹199 Minimum for home delivery
const FREE_SHIPPING_THRESHOLD = 799; // ₹799 for free delivery

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

  // Supports both cart and cartItems props
  const items = cartItems.length > 0 ? cartItems : cart;

  // Calculate pricing
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.price || item.selling_price) || 0) *
        (Number(item.quantity) || 1),
    0,
  );

  const totalMrp = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.mrp || item.price || item.selling_price) || 0) *
        (Number(item.quantity) || 1),
    0,
  );

  const totalSavings = Math.max(0, totalMrp - subtotal);
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const isBelowMinimum = subtotal < MIN_ORDER_VALUE;

  const handleCheckoutClick = () => {
    if (isBelowMinimum) return;
    if (onProceedToCheckout) onProceedToCheckout();
    else if (onCheckout) onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 relative">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your Shopping Bag
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {items.length} {items.length === 1 ? "item" : "items"} in
                counter bag
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        {items.length > 0 && (
          <div className="p-3.5 bg-emerald-50/70 border-b border-emerald-100 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-900 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {isFreeDelivery
                  ? "🎉 You have qualified for FREE Tricity / Pan-India Delivery!"
                  : `Add ₹${remainingForFree} more for FREE Delivery`}
              </span>
              <span className="text-emerald-700 font-mono font-extrabold">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                🛍️
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Your bag is empty
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore authentic skincare, daily wellness supplements, and baby
                care essentials.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition cursor-pointer"
              >
                Browse Pharmacy Stock
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemId = item.id;
              const title = item.name || item.title || "Medicine Item";
              const brand = item.brand || item.brand_name || "Pharma";
              const unit = item.unit || item.size_volume || "";
              const price = Number(item.price || item.selling_price) || 0;
              const mrp = Number(item.mrp) || price;
              const currentQty = Number(item.quantity) || 1;
              const thumb =
                Array.isArray(item.image_urls) && item.image_urls[0]
                  ? item.image_urls[0]
                  : item.image_url || item.image || "/placeholder-med.png";

              return (
                <div
                  key={itemId}
                  className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={thumb}
                      alt={title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100";
                      }}
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-xs font-bold text-slate-900 truncate"
                      title={title}
                    >
                      {title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {brand} {unit && `• ${unit}`}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        ₹{price}
                      </span>
                      {mrp > price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRemoveItem && onRemoveItem(itemId)}
                      className="text-slate-300 hover:text-rose-500 transition p-0.5 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-slate-200 rounded-full bg-slate-50/80 p-0.5 shadow-2xs">
                      {/* Decrement (-) Button */}
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity &&
                          onUpdateQuantity(itemId, currentQty - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-slate-600 hover:text-slate-900 transition active:scale-95 cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-6 text-center text-xs font-bold text-slate-800 font-mono">
                        {currentQty}
                      </span>

                      {/* Increment (+) Button */}
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity &&
                          onUpdateQuantity(itemId, currentQty + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-slate-600 hover:text-slate-900 transition active:scale-95 cursor-pointer"
                        title="Increase quantity"
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

        {/* Drawer Footer & Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono font-medium">₹{subtotal}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Store Discount Savings</span>
                  <span className="font-mono">-₹{totalSavings}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Estimated Delivery</span>
                <span className="font-mono font-medium">
                  {isFreeDelivery ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    "₹49"
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Payable Total</span>
                <span className="font-mono text-emerald-800 text-base">
                  ₹{subtotal + (isFreeDelivery ? 0 : 49)}
                </span>
              </div>
            </div>

            {/* Minimum Order Warning */}
            {isBelowMinimum && (
              <p className="text-[11px] text-amber-700 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
                ⚠️ Minimum order value is ₹{MIN_ORDER_VALUE} for home delivery.
              </p>
            )}

            {/* Checkout Button */}
            <button
              type="button"
              disabled={isBelowMinimum}
              onClick={handleCheckoutClick}
              className={`w-full py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                isBelowMinimum
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 text-white active:scale-98 shadow-slate-950/20 cursor-pointer"
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
