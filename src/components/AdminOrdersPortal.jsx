// src/components/AdminOrdersPortal.jsx
import React, { useState, useEffect } from "react";
import {
  Lock,
  Package,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Printer,
  X,
  Upload,
  Sparkles,
  AlertCircle,
  Layers,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const STORE_PINS = ["3500", "9872", "1234"];

export default function AdminOrdersPortal({ onClose, onProductAdded }) {
  // Authentication State
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("getwell_admin_auth") === "true";
  });
  const [pinError, setPinError] = useState(false);

  // Active Navigation Tab: 'orders' | 'add_product'
  const [activeTab, setActiveTab] = useState("orders");

  // Live Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState("All");

  // Product Creator State
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "Clinical Skincare",
    unit: "100 g",
    price: "",
    mrp: "",
    expiry_date: "",
    description: "",
    in_stock: true,
    image_url_fallback: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [productSuccess, setProductSuccess] = useState("");
  const [productError, setProductError] = useState("");

  // 1. PIN Authentication
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (STORE_PINS.includes(pin.trim())) {
      setIsAuthenticated(true);
      sessionStorage.setItem("getwell_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("getwell_admin_auth");
    setIsAuthenticated(false);
    setPin("");
  };

  // 2. Fetch Live Orders from Supabase
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.warn("Orders fetch note:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // 3. Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("order_id", orderId);

      if (!error) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId ? { ...o, order_status: newStatus } : o,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // 4. Handle Multi-Image Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate local previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemovePhoto = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 5. Publish New Product to Supabase
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductError("");
    setProductSuccess("");

    if (
      !newProduct.name.trim() ||
      !newProduct.brand.trim() ||
      !newProduct.price
    ) {
      setProductError("Please fill in product name, brand, and selling price.");
      return;
    }

    setUploadingProduct(true);
    const uploadedUrls = [];

    try {
      // A. Upload all selected photos to Supabase Storage 'product-images'
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, file, { cacheControl: "3600", upsert: false });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              uploadedUrls.push(publicUrlData.publicUrl);
            }
          }
        }
      }

      // If user provided a fallback URL or no files uploaded
      if (uploadedUrls.length === 0 && newProduct.image_url_fallback.trim()) {
        uploadedUrls.push(newProduct.image_url_fallback.trim());
      }

      const primaryImage =
        uploadedUrls[0] ||
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600";

      // B. Insert into 'products' table (sends both 'name' and 'title' for schema compatibility)
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: newProduct.name.trim(),
            title: newProduct.name.trim(), // Supports both 'name' and 'title' columns
            brand: newProduct.brand.trim(),
            category: newProduct.category,
            unit: newProduct.unit.trim(),
            price: Number(newProduct.price),
            mrp: Number(newProduct.mrp || newProduct.price),
            expiry_date: newProduct.expiry_date.trim() || "Direct Fresh Batch",
            description: newProduct.description.trim(),
            image_url: primaryImage,
            image_urls: uploadedUrls.length > 0 ? uploadedUrls : [primaryImage],
            in_stock: newProduct.in_stock,
            rating: 5.0,
            rating_count: 1,
          },
        ])
        .select();

      if (error) throw error;

      setProductSuccess(
        `"${newProduct.name}" published successfully to live storefront!`,
      );

      // Reset form
      setNewProduct({
        name: "",
        brand: "",
        category: "Clinical Skincare",
        unit: "100 g",
        price: "",
        mrp: "",
        expiry_date: "",
        description: "",
        in_stock: true,
        image_url_fallback: "",
      });
      setSelectedFiles([]);
      setFilePreviews([]);

      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error("Product upload error:", err);
      setProductError(err.message || "Failed to save product to Supabase.");
    } finally {
      setUploadingProduct(false);
    }
  };

  // 6. Print Thermal Slip
  const handlePrintSlip = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Packing Slip - #${order.order_id}</title>
          <style>
            body { font-family: monospace; padding: 20px; font-size: 13px; max-width: 320px; margin: 0 auto; }
            h2 { text-align: center; margin: 0; }
            .line { border-top: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>GETWELL MEDICOS</h2>
          <p style="text-align:center; margin:2px 0;">Booth 13, Sec 35C, Chandigarh<br/>Ph: +91 9872633001</p>
          <div class="line"></div>
          <p><b>Order ID:</b> #${order.order_id}</p>
          <p><b>Customer:</b> ${order.customer_name}<br/><b>Phone:</b> ${order.customer_phone}</p>
          <p><b>Address:</b> ${order.delivery_address}</p>
          <div class="line"></div>
          <p class="bold">ITEMS ORDERED:</p>
          ${(order.items || []).map((i) => `<div class="row"><span>${i.name || i.title} x${i.quantity}</span><span>₹${i.price * i.quantity}</span></div>`).join("")}
          <div class="line"></div>
          <div class="row bold"><span>Total Payable:</span><span>₹${order.total_amount}</span></div>
          <p><b>Payment:</b> ${order.payment_method} (${order.payment_status})</p>
          <div class="line"></div>
          <p style="text-align:center;">Packed by Certified Pharmacist<br/>Getwell Sec 35C</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ================= RENDER: PIN LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Getwell Store Operations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sector 35C Counter • Dispatch & Inventory Hub
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              placeholder="Enter 4-Digit Store PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-bold py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-emerald-500"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-rose-400 font-semibold">
                Invalid PIN. Use 3500 or 9872.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Unlock Operations Portal
            </button>
          </form>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ← Back to Public Store
          </button>
        </div>
      </div>
    );
  }

  // Quick KPI metrics
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0,
  );
  const pendingDispatch = orders.filter(
    (o) => o.order_status === "Received" || o.order_status === "Packed",
  ).length;

  const filteredOrders = orders.filter(
    (o) => orderFilter === "All" || o.order_status === orderFilter,
  );

  // ================= RENDER: AUTHENTICATED PORTAL =================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Operations Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Getwell Store Operations Hub
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Sector 35C Counter • Dispatch Desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Lock Portal
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* KPI Stats Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-[11px] text-slate-400 font-medium">
              TOTAL SALES VOLUME
            </p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-[11px] text-slate-400 font-medium">
              TOTAL ORDERS PLACED
            </p>
            <p className="text-lg font-bold text-white mt-0.5">
              {orders.length}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-[11px] text-slate-400 font-medium">
              PENDING DISPATCH
            </p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">
              {pendingDispatch}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 px-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("add_product")}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === "add_product"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <PlusCircle className="w-4 h-4" />+ Add New Medicine / Product
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* ================= TAB 1: ORDERS DISPATCH ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {["All", "Received", "Packed", "Dispatched", "Delivered"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        orderFilter === status
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={fetchOrders}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ↻ Refresh Live Orders
              </button>
            </div>

            {/* Orders Cards Grid */}
            {loadingOrders ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
                No orders found under "{orderFilter}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id || order.order_id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Order ID & Status Badge */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            #{order.order_id}
                          </span>
                          <p className="text-[10px] text-slate-500">
                            {new Date(order.created_at).toLocaleString(
                              "en-IN",
                              { timeZone: "Asia/Kolkata" },
                            )}
                          </p>
                        </div>

                        <select
                          value={order.order_status || "Received"}
                          onChange={(e) =>
                            handleUpdateOrderStatus(
                              order.order_id,
                              e.target.value,
                            )
                          }
                          className="text-xs font-semibold bg-slate-800 text-emerald-300 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-emerald-500 cursor-pointer"
                        >
                          <option value="Received">📥 Received</option>
                          <option value="Packed">📦 Packed</option>
                          <option value="Dispatched">🛵 Dispatched</option>
                          <option value="Delivered">✅ Delivered</option>
                        </select>
                      </div>

                      {/* Customer Details */}
                      <div className="py-3 space-y-1.5 text-xs text-slate-300">
                        <p className="font-bold text-white flex items-center justify-between">
                          <span>{order.customer_name}</span>
                          <a
                            href={`tel:${order.customer_phone}`}
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone className="w-3 h-3" /> {order.customer_phone}
                          </a>
                        </p>
                        <p className="text-slate-400 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {order.delivery_address}
                          </span>
                        </p>
                      </div>

                      {/* Items List */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                          Ordered Items
                        </p>
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-slate-300"
                          >
                            <span className="truncate max-w-[180px]">
                              {item.name || item.title}{" "}
                              <strong className="text-emerald-400">
                                x{item.quantity}
                              </strong>
                            </span>
                            <span>
                              ₹
                              {(Number(item.price) || 0) * (item.quantity || 1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer & Actions */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400">
                          {order.payment_method}
                        </p>
                        <p className="text-sm font-bold text-emerald-400">
                          ₹{order.total_amount}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/91${order.customer_phone?.replace(/\D/g, "")}?text=Hello%20${order.customer_name},%20this%20is%20Getwell%20Medicos%20Sec%2035C.%20Regarding%20your%20Order%20%23${order.order_id}:`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold rounded-lg transition"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => handlePrintSlip(order)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                          title="Print Thermal Packing Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: PRODUCT CREATOR ================= */}
        {activeTab === "add_product" && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Publish New Medicine / Skincare to Supabase
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Directly uploads high-res photos to Supabase Storage and lists
                the item on your storefront catalog.
              </p>
            </div>

            {productSuccess && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{productSuccess}</span>
              </div>
            )}

            {productError && (
              <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{productError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {/* Product Title */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Product Title / Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahaglow Glogeous Advanced Face Wash Gel"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Torrent Pharma"
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, brand: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-emerald-500 cursor-pointer"
                  >
                    <option value="Clinical Skincare">Clinical Skincare</option>
                    <option value="Baby Care">Baby Care</option>
                    <option value="Daily Wellness">Daily Wellness</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Prescription Drugs">
                      Prescription Drugs
                    </option>
                    <option value="Ayurvedic / Herbal">
                      Ayurvedic / Herbal
                    </option>
                  </select>
                </div>
              </div>

              {/* Selling Price, MRP, Pack Size */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="720"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="845"
                    value={newProduct.mrp}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, mrp: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">
                    Pack Size / Unit
                  </label>
                  <input
                    type="text"
                    placeholder="100 g / 10 Tabs"
                    value={newProduct.unit}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unit: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Batch Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12/2026 or Fresh Batch"
                  value={newProduct.expiry_date}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      expiry_date: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>

              {/* Rich Description */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Product Description & Key Benefits
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter key benefits, active ingredients, dosage or directions for use..."
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>

              {/* Multi-Photo Upload Area */}
              <div className="space-y-2 pt-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  Product Photos (Select 1 or Multiple Photos)
                </label>

                <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 text-center bg-slate-950/60 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="multi-image-input"
                  />
                  <label
                    htmlFor="multi-image-input"
                    className="cursor-pointer flex flex-col items-center gap-1.5 py-2 text-slate-400 hover:text-emerald-400 transition"
                  >
                    <Upload className="w-6 h-6 text-slate-500" />
                    <span className="font-semibold text-xs text-white">
                      Click to select 1 or more photos
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Supports JPG, PNG, WEBP (Uploads to Supabase Storage)
                    </span>
                  </label>
                </div>

                {/* Previews Grid */}
                {filePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {filePreviews.map((previewUrl, index) => (
                      <div
                        key={index}
                        className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-square"
                      >
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="w-full h-full object-contain p-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-90 hover:opacity-100 transition cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback URL input */}
                <div className="pt-1">
                  <input
                    type="url"
                    placeholder="Or paste an image URL (optional)"
                    value={newProduct.image_url_fallback}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        image_url_fallback: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 text-xs focus:outline-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploadingProduct}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
              >
                {uploadingProduct ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading photos & publishing to Supabase...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Product to Live Website</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
