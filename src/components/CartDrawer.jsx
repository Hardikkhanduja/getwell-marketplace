import React from "react";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

  const MIN_ORDER_VALUE = 199;
  const FREE_SHIPPING_THRESHOLD = 799;

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const isBelowMinOrder = cartTotal < MIN_ORDER_VALUE;
  const amountNeededForMin = MIN_ORDER_VALUE - cartTotal;
  const amountNeededForFreeShip = FREE_SHIPPING_THRESHOLD - cartTotal;

  // Free shipping progress percentage (max 100%)
  const freeShipPercent = Math.min(
    100,
    Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Shopping Bag
                </h2>
                <span className="text-xs font-bold bg-[#e8f2ec] text-[#2c5240] px-2 py-0.5 rounded-full">
                  {totalCount} {totalCount === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Close bag"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {cart.length > 0 && (
              <div className="mt-3.5 bg-[#faf9f5] border border-gray-200 rounded-2xl p-3 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      🎉 You unlocked <strong>FREE Delivery</strong> across
                      Tricity!
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      Add <strong>₹{amountNeededForFreeShip}</strong> more for{" "}
                      <strong>FREE Delivery</strong>!
                    </span>
                  )}
                  <span className="font-bold text-gray-800">
                    {freeShipPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2c5240] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${freeShipPercent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto mt-3 pr-1">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-xl">
                    🛍️
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Your shopping bag is empty.
                  </p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemImg =
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : item.image;
                  return (
                    <div
                      key={item.id}
                      className="py-3.5 flex items-center justify-between gap-3 group"
                    >
                      <img
                        src={itemImg}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80";
                        }}
                        className="w-12 h-12 object-contain bg-[#fbfbfa] border border-gray-100 rounded-xl p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600 font-bold mt-0.5">
                          ₹{item.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-xl px-1.5 py-0.5 bg-gray-50 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="text-xs font-bold text-gray-600 hover:text-black px-1.5 py-0.5"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-1.5 text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="text-xs font-bold text-gray-600 hover:text-black px-1.5 py-0.5"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          title="Remove from bag"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-gray-100 space-y-3 bg-white">
              <div className="flex justify-between text-sm font-bold text-gray-900">
                <span>Products Subtotal</span>
                <span className="text-base font-extrabold text-[#071610]">
                  ₹{cartTotal}
                </span>
              </div>

              {/* Minimum Order Check (₹199 Threshold) */}
              {isBelowMinOrder ? (
                <div className="space-y-2">
                  <div className="bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl text-center text-xs text-amber-900 font-medium">
                    ⚠️ Minimum home delivery order is{" "}
                    <strong>₹{MIN_ORDER_VALUE}</strong>. Add{" "}
                    <strong>₹{amountNeededForMin}</strong> more to checkout.
                  </div>
                  <p className="text-[11px] text-gray-500 text-center">
                    *For single items below ₹199, visit our{" "}
                    <strong>Sector 35C counter</strong> in person!
                  </p>
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-xl text-xs font-bold cursor-not-allowed transition-all"
                  >
                    Minimum Order Required: ₹{MIN_ORDER_VALUE} (Current: ₹
                    {cartTotal})
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-gray-500">
                    *Tricity bike dispatch calculated at actual distance fare /
                    Free above ₹799.
                  </p>
                  <button
                    onClick={onProceedToCheckout}
                    className="w-full bg-[#071610] hover:bg-[#2c5240] text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Order (₹{cartTotal})</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
