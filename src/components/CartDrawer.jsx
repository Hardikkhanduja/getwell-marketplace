import React from 'react';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveFromCart, onProceedToCheckout }) {
  if (!isOpen) return null;

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Your Bag ({totalCount})</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
                ✕
              </button>
            </div>

            <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto mt-4 pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">Your bag is empty.</div>
              ) : (
                cart.map((item) => {
                  const itemImg = item.images && item.images.length > 0 ? item.images[0] : item.image;
                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 group">
                      <img 
                        src={itemImg} 
                        alt={item.name} 
                        className="w-12 h-12 object-contain bg-[#fbfbfa] border border-gray-100 rounded-lg p-1 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 font-semibold mt-0.5">₹{item.price}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1 bg-gray-50">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-xs font-bold text-gray-600 hover:text-black px-1">
                            -
                          </button>
                          <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-xs font-bold text-gray-600 hover:text-black px-1">
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          title="Remove from bag"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-sm font-bold text-gray-900">
                <span>Products Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <p className="text-[11px] text-gray-500">
                *Tricity bike dispatch calculated at actual distance fare / Postal weight for courier. Free over ₹799.
              </p>
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-[#071610] hover:bg-[#2c5240] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Proceed to Order (₹{cartTotal})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
