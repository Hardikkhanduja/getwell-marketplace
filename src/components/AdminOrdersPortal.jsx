import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AdminOrdersPortal({
  isOpen,
  onClose,
  currentProducts,
  onProductSaved,
  onProductDeleted,
}) {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("getwell_admin_auth") === "true";
  });
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'products' | 'add_product'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Product Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [brandName, setBrandName] = useState("Cetaphil");
  const [concern, setConcern] = useState("Clinical Skincare");
  const [sizeVolume, setSizeVolume] = useState("");
  const [mrp, setMrp] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("12/2026");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Authenticate PIN
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === "3500" || pin === "9872") {
      setIsAuthenticated(true);
      sessionStorage.setItem("getwell_admin_auth", "true");
    } else {
      alert("Incorrect Store PIN. (Default PIN: 3500)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("getwell_admin_auth");
  };

  // Fetch Orders from Supabase
  const fetchOrders = async () => {
    if (!supabase) return;
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Update Order Status in Supabase
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Upload Product Photo to Supabase Storage
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !supabase) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (publicUrlData && publicUrlData.publicUrl) {
        setImageUrl(publicUrlData.publicUrl);
      }
    } catch (err) {
      alert('Photo upload failed. Ensure "product-images" bucket is public.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Product to Supabase
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!title || !price || !supabase) return;

    try {
      setSavingProduct(true);
      const payload = {
        title,
        subtitle,
        brand_name: brandName,
        concern,
        size_volume: sizeVolume,
        mrp: mrp ? parseFloat(mrp) : parseFloat(price),
        price: parseFloat(price),
        expiry_date: expiryDate,
        image_url: imageUrl || "/Cetaphil-Gentle.png",
        in_stock: true,
        rating: 4.9,
        reviews_count: 50,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select();
      if (error) throw error;

      alert("Product published live!");
      onProductSaved(data[0]);
      setTitle("");
      setSubtitle("");
      setPrice("");
      setMrp("");
      setImageUrl("");
      setActiveTab("products");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  // Toggle In-Stock Status
  const handleToggleProductStock = async (product) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: !product.inStock })
        .eq("id", product.id);

      if (error) throw error;
      product.inStock = !product.inStock;
      onProductSaved(product);
    } catch (err) {
      alert("Error updating stock: " + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently from the live store?"))
      return;
    if (!supabase) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      onProductDeleted(id);
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  // Print Packing Slip
  const handlePrintSlip = (order) => {
    const printWindow = window.open("", "_blank");
    const itemsRows = order.items
      .map(
        (it, idx) =>
          `<tr><td style="padding:6px;border-bottom:1px solid #eee;">${idx + 1}. ${it.name}</td><td style="padding:6px;text-align:center;border-bottom:1px solid #eee;">${it.quantity}</td><td style="padding:6px;text-align:right;border-bottom:1px solid #eee;">₹${it.price * it.quantity}</td></tr>`,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Packing Slip #${order.order_number}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #111; }
            .header { border-bottom: 2px solid #071610; padding-bottom: 10px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { text-align: left; background: #f4f4f4; padding: 6px; font-size: 12px; }
            td { font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0;">GETWELL MEDICOS</h2>
            <p style="margin:2px 0 0;font-size:12px;color:#555;">Booth No. 13, Sector 35C, Chandigarh | Phone: +91 9872633001</p>
          </div>
          <p style="font-size:13px;"><strong>Order ID:</strong> #${order.order_number} | <strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          <p style="font-size:13px;"><strong>Customer:</strong> ${order.customer_name} (${order.phone})<br/>
          <strong>Deliver to:</strong> ${order.address}, ${order.city} - ${order.pincode}</p>
          <p style="font-size:13px;"><strong>Payment Mode:</strong> ${order.payment_method} ${order.payment_id ? `(Ref: ${order.payment_id})` : ""}</p>
          <table>
            <thead><tr><th>Product Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Total</th></tr></thead>
            <tbody>${itemsRows}</tbody>
          </table>
          <h3 style="text-align:right;margin-top:15px;">Payable Total: ₹${order.total_amount}</h3>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "ALL") return true;
    return (o.status || "PENDING_DISPATCH") === filterStatus;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (parseFloat(o.total_amount) || 0),
    0,
  );
  const pendingOrdersCount = orders.filter(
    (o) => (o.status || "PENDING_DISPATCH") === "PENDING_DISPATCH",
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-[#071610] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wide uppercase">
                Getwell Medicos Store Operations
              </h2>
              <p className="text-[11px] text-gray-400">
                Sector 35C Counter &bull; Supabase Live Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded-lg border border-red-500/30"
              >
                Lock Portal
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center text-sm font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PIN Security Form */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-sm w-full bg-[#faf9f5] border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#071610] text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                🔒
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Authorized Personnel Only
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your 4-digit store PIN to access customer orders.
                </p>
              </div>
              <form onSubmit={handlePinSubmit} className="space-y-3">
                <input
                  type="password"
                  maxLength="4"
                  required
                  placeholder="PIN (Default: 3500)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full text-center text-2xl tracking-widest bg-white border border-gray-300 rounded-xl p-3 font-mono focus:outline-none focus:ring-2 focus:ring-[#071610]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Verify &amp; Unlock
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* KPI Metrics Strip */}
            <div className="bg-[#faf9f5] border-b border-gray-200 px-6 py-3.5 grid grid-cols-3 gap-4 shrink-0">
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Sales Volume
                </p>
                <p className="text-lg font-extrabold text-[#071610] mt-0.5">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Orders Placed
                </p>
                <p className="text-lg font-extrabold text-blue-700 mt-0.5">
                  {orders.length}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Pending Counter Dispatch
                </p>
                <p className="text-lg font-extrabold text-amber-600 mt-0.5">
                  {pendingOrdersCount}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "orders"
                      ? "bg-[#071610] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  📦 Customer Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "products"
                      ? "bg-[#071610] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  🛍️ Product Catalog ({currentProducts.length})
                </button>
                <button
                  onClick={() => setActiveTab("add_product")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "add_product"
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  + Add New Product
                </button>
              </div>

              {activeTab === "orders" && (
                <div className="flex items-center gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs bg-[#faf9f5] border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING_DISPATCH">Pending Dispatch</option>
                    <option value="DISPATCHED">Dispatched on Bike</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <button
                    onClick={fetchOrders}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold"
                    title="Refresh Orders"
                  >
                    🔄
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: ORDERS LIST */}
            {activeTab === "orders" && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fbfbfa]">
                {loadingOrders ? (
                  <div className="py-20 text-center text-xs text-gray-500">
                    Loading orders from Supabase...
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-20 text-center text-xs text-gray-400">
                    No orders found under this filter.
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const cleanPhone = order.phone
                      .replace(/[^0-9]/g, "")
                      .slice(-10);
                    const whatsappDirectLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                      `Hi ${order.customer_name}, this is Getwell Medicos (Sector 35C Chandigarh) regarding your order #${order.order_number}.`,
                    )}`;

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3.5 hover:border-gray-300 transition-all"
                      >
                        {/* Top row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-sm text-[#071610]">
                              Order #{order.order_number}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(order.created_at).toLocaleString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status Selector */}
                            <select
                              value={order.status || "PENDING_DISPATCH"}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  e.target.value,
                                )
                              }
                              className={`text-xs font-bold rounded-lg px-2.5 py-1 border ${
                                (order.status || "PENDING_DISPATCH") ===
                                "PENDING_DISPATCH"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : (order.status || "") === "DISPATCHED"
                                    ? "bg-blue-50 text-blue-800 border-blue-300"
                                    : (order.status || "") === "DELIVERED"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                      : "bg-red-50 text-red-800 border-red-300"
                              }`}
                            >
                              <option value="PENDING_DISPATCH">
                                ⏳ Pending Dispatch
                              </option>
                              <option value="DISPATCHED">
                                🚴 Dispatched via Bike
                              </option>
                              <option value="DELIVERED">✅ Delivered</option>
                              <option value="CANCELLED">❌ Cancelled</option>
                            </select>

                            <button
                              onClick={() => handlePrintSlip(order)}
                              className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold border border-gray-200"
                              title="Print Packaging Slip"
                            >
                              🖨️ Slip
                            </button>
                          </div>
                        </div>

                        {/* Customer & Delivery row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-bold text-gray-900">
                              {order.customer_name}
                            </p>
                            <p className="text-gray-600 mt-0.5">
                              {order.address}, {order.city} - {order.pincode}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <a
                                href={whatsappDirectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#1b8744] hover:bg-[#25D366]/20 font-bold rounded-lg border border-[#25D366]/30 transition-colors"
                              >
                                <span>💬 Chat (+91 {cleanPhone})</span>
                              </a>
                              <a
                                href={`tel:+91${cleanPhone}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                              >
                                <span>📞 Call</span>
                              </a>
                            </div>
                          </div>

                          <div className="bg-[#faf9f5] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                            <div>
                              <p className="text-[11px] text-gray-500 font-semibold uppercase">
                                Payment Information
                              </p>
                              <p className="font-bold text-gray-900 mt-0.5">
                                {order.payment_method}{" "}
                                {order.payment_id && (
                                  <span className="text-[10px] text-gray-500 font-mono">
                                    ({order.payment_id})
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex items-center justify-between mt-2">
                              <span className="text-gray-500">
                                Payable Total:
                              </span>
                              <span className="font-extrabold text-sm text-[#071610]">
                                ₹{order.total_amount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Items ordered pills */}
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Items to Pack:
                          </p>
                          <div className="space-y-1">
                            {Array.isArray(order.items) &&
                              order.items.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-xs text-gray-700"
                                >
                                  <span>
                                    • <strong>{it.name}</strong> × {it.quantity}
                                  </span>
                                  <span className="font-semibold">
                                    ₹{it.price * it.quantity}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
            {activeTab === "products" && (
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100 bg-[#fbfbfa]">
                {currentProducts.map((p) => {
                  const img =
                    p.images && p.images.length > 0 ? p.images[0] : p.image;
                  return (
                    <div
                      key={p.id}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <img
                        src={img}
                        alt={p.name}
                        className="w-14 h-14 object-contain bg-white border border-gray-200 rounded-xl p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          <strong>₹{p.price}</strong> (MRP: ₹{p.originalPrice})
                          &bull; {p.brand} &bull; {p.category}
                        </p>
                        {p.expiryDate && (
                          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            Fresh Expiry: {p.expiryDate}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleProductStock(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            p.inStock !== false
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {p.inStock !== false ? "In Stock" : "Out of Stock"}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                          title="Delete product"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: ADD NEW PRODUCT */}
            {activeTab === "add_product" && (
              <form
                onSubmit={handleSaveProduct}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-white"
              >
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Publish Product to Supabase
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cetaphil Gentle Cleanser (250ml)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cetaphil"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Category / Skin Concern
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dry & Sensitive Skin"
                      value={concern}
                      onChange={(e) => setConcern(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="395"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="440"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="12/2026"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Product Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#071610] file:text-white cursor-pointer"
                  />
                  {uploadingImage && (
                    <span className="text-xs text-emerald-700 ml-2 animate-pulse">
                      Uploading...
                    </span>
                  )}
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full mt-2 bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProduct || uploadingImage}
                  className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3 rounded-xl text-xs font-bold transition-all"
                >
                  {savingProduct
                    ? "Saving to Database..."
                    : "Publish Product to Live Website"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
