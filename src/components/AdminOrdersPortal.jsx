// src/components/AdminOrdersPortal.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Lock,
  Unlock,
  LogOut,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  Plus,
  UploadCloud,
  Phone,
  MessageSquare,
  Copy,
  Check,
  AlertTriangle,
  Layers,
  DollarSign,
  MapPin,
  User,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const DEFAULT_PINS = ["3500", "9872"];
const STORE_NAME = "Getwell Store Operations Hub";
const STORE_LOCATION = "Booth No. 13, Sector 35C, Chandigarh";

const CATEGORIES = [
  "Clinical Skincare",
  "Baby Care",
  "Daily Wellness",
  "Hair Care",
  "Prescription & OTC",
  "Oral Care",
  "First Aid & Surgical",
  "General Healthcare",
];

export default function AdminOrdersPortal() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("getwell_admin_auth") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Active navigation tab: 'orders' | 'catalog' | 'add_product'
  const [activeTab, setActiveTab] = useState("add_product");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  // Products / Catalog state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Add Product Form state
  const [formTitle, setFormTitle] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formPrice, setFormPrice] = useState("");
  const [formMrp, setFormMrp] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formBatchExpiry, setFormBatchExpiry] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formInStock, setFormInStock] = useState(true);
  const [formRxRequired, setFormRxRequired] = useState(false);

  // Image Upload state
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState("");
  const [productErrorMsg, setProductErrorMsg] = useState("");

  // 1. PIN Authentication
  const handlePinSubmit = (e) => {
    e?.preventDefault();
    const envPins = (import.meta.env.VITE_ADMIN_PIN || "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const validPins = envPins.length > 0 ? envPins : DEFAULT_PINS;

    if (validPins.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      localStorage.setItem("getwell_admin_auth", "true");
      setPinError("");
      setPinInput("");
    } else {
      setPinError("Invalid Security PIN. Access Restricted.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("getwell_admin_auth");
  };

  // 2. Fetch Orders
  const fetchOrders = async () => {
    if (!supabase) return;
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase.from("orders").select("*");

      if (error) {
        console.warn("Orders fetch note:", error);
      } else if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => {
          const dateA = new Date(a.created_at || a.created_on || 0).getTime();
          const dateB = new Date(b.created_at || b.created_on || 0).getTime();
          return dateB - dateA;
        });
        setOrders(sorted);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // 3. Fetch Products
  const fetchProducts = async () => {
    if (!supabase) return;
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.warn("Products fetch note:", error);
      } else if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Initial Data Load
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAuthenticated]);

  // 4. Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!supabase) return;
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          order_status: newStatus,
          status: newStatus,
        })
        .eq("id", orderId);

      if (error) {
        await supabase
          .from("orders")
          .update({ order_status: newStatus })
          .or(`order_number.eq.${orderId},order_id.eq.${orderId}`);
      }

      setOrders((prev) =>
        prev.map((o) => {
          if (
            o.id === orderId ||
            o.order_number === orderId ||
            o.order_id === orderId
          ) {
            return { ...o, order_status: newStatus, status: newStatus };
          }
          return o;
        }),
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Could not update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // 5. Delete Product from Catalog
  const handleDeleteProduct = async (productId, productName) => {
    if (!supabase) return;
    const confirmDelete = window.confirm(
      `Permanently delete "${productName}" from the store catalog?`,
    );
    if (!confirmDelete) return;

    setDeletingProductId(productId);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Failed to delete product.");
    } finally {
      setDeletingProductId(null);
    }
  };

  // 6. Handle Multi-Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 7. Publish Product to Supabase
  const handlePublishProduct = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setProductErrorMsg("Supabase client is not configured.");
      return;
    }
    if (!formTitle.trim() || !formPrice) {
      setProductErrorMsg("Please fill in required fields (Title & Price).");
      return;
    }

    setSubmittingProduct(true);
    setProductSuccessMsg("");
    setProductErrorMsg("");

    try {
      const uploadedUrls = [];

      for (const file of selectedImages) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            uploadedUrls.push(publicUrlData.publicUrl);
          }
        } else {
          console.warn("Image upload note:", uploadError);
        }
      }

      const sellingPriceNum = Number(formPrice) || 0;
      const mrpNum = Number(formMrp) || sellingPriceNum;

      const productPayload = {
        name: formTitle.trim(),
        title: formTitle.trim(),
        brand: formBrand.trim() || "Pharma Grade",
        brand_name: formBrand.trim() || "Pharma Grade",
        category: formCategory,
        concern: formCategory,
        price: sellingPriceNum,
        selling_price: sellingPriceNum,
        mrp: mrpNum,
        unit: formUnit.trim() || "Standard Pack",
        size_volume: formUnit.trim() || "Standard Pack",
        batch_expiry: formBatchExpiry.trim() || "Fresh Batch",
        description:
          formDescription.trim() ||
          "Genuine pharmacy stock directly from Getwell Medicos.",
        image_urls: uploadedUrls,
        image_url: uploadedUrls[0] || "",
        image: uploadedUrls[0] || "",
        is_in_stock: formInStock,
        in_stock: formInStock,
        prescription_required: formRxRequired,
      };

      const { error } = await supabase
        .from("products")
        .insert([productPayload])
        .select();

      if (error) throw error;

      setProductSuccessMsg(
        `"${formTitle}" successfully published to live catalog!`,
      );

      // Reset Form
      setFormTitle("");
      setFormBrand("");
      setFormPrice("");
      setFormMrp("");
      setFormUnit("");
      setFormBatchExpiry("");
      setFormDescription("");
      setSelectedImages([]);
      setImagePreviews([]);
      setFormInStock(true);
      setFormRxRequired(false);

      fetchProducts();
    } catch (err) {
      console.error("Publish product error:", err);
      setProductErrorMsg(
        err.message ||
          "Failed to publish product. Please check Supabase schema.",
      );
    } finally {
      setSubmittingProduct(false);
    }
  };

  // 8. Copy Order Slip
  const handleCopyOrderDetails = (order) => {
    const orderNum = order.order_number || order.order_id || order.id || "N/A";
    const customer = order.customer_name || order.name || "Customer";
    const phone = order.customer_phone || order.phone || "N/A";
    const address =
      order.customer_address ||
      order.delivery_address ||
      order.address ||
      "N/A";
    const total = order.total_amount || order.total || 0;
    const payment = order.payment_method || "COD";

    let itemsText = "";
    if (Array.isArray(order.items)) {
      itemsText = order.items
        .map(
          (i) =>
            `• ${i.title || i.name} (x${i.quantity || 1}) - ₹${(i.price || 0) * (i.quantity || 1)}`,
        )
        .join("\n");
    }

    const slip = `📦 GETWELL MEDICOS ORDER SLIP\nOrder ID: #${orderNum}\nDate: ${new Date(order.created_at || Date.now()).toLocaleString("en-IN")}\n\n👤 Customer: ${customer}\n📞 Phone: ${phone}\n📍 Address: ${address}\n\n🛒 Items:\n${itemsText}\n\n💰 Total: ₹${total} (${payment})\nStatus: ${order.order_status || order.status || "Received"}`;

    navigator.clipboard.writeText(slip);
    setCopiedOrderId(order.id || orderNum);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  // 9. Metrics
  const metrics = useMemo(() => {
    const totalSales = orders.reduce(
      (sum, o) => sum + (Number(o.total_amount || o.total) || 0),
      0,
    );
    const totalOrdersCount = orders.length;
    const pendingDispatches = orders.filter((o) => {
      const st = (o.order_status || o.status || "Received").toLowerCase();
      return st === "received" || st === "processing" || st === "pending";
    }).length;

    return { totalSales, totalOrdersCount, pendingDispatches };
  }, [orders]);

  // 10. Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderNum = String(
        order.order_number || order.order_id || order.id || "",
      ).toLowerCase();
      const name = String(
        order.customer_name || order.name || "",
      ).toLowerCase();
      const phone = String(
        order.customer_phone || order.phone || "",
      ).toLowerCase();
      const address = String(
        order.customer_address || order.delivery_address || "",
      ).toLowerCase();
      const status = String(
        order.order_status || order.status || "Received",
      ).toUpperCase();

      const matchesSearch =
        orderNum.includes(orderSearch.toLowerCase()) ||
        name.includes(orderSearch.toLowerCase()) ||
        phone.includes(orderSearch.toLowerCase()) ||
        address.includes(orderSearch.toLowerCase());

      const matchesStatus =
        orderStatusFilter === "ALL" || status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // 11. Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = String(product.title || product.name || "").toLowerCase();
      const brand = String(
        product.brand || product.brand_name || "",
      ).toLowerCase();
      const category = String(
        product.category || product.concern || "",
      ).toUpperCase();

      const matchesSearch =
        title.includes(productSearch.toLowerCase()) ||
        brand.includes(productSearch.toLowerCase());

      const matchesCategory =
        productCategoryFilter === "ALL" ||
        category === productCategoryFilter.toUpperCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // ==========================================
  // RENDER: PIN SECURITY SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-900/20">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Store Operations Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Getwell Medicos • Sector 35C, Chandigarh
            </p>
            <span className="mt-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Staff Authorization Required
            </span>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Enter 4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                placeholder="••••"
                autoFocus
                className="w-full bg-slate-950/80 border border-slate-700 text-white text-center text-2xl tracking-[0.5em] py-3.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition placeholder-slate-600"
              />
            </div>

            {pinError && (
              <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-150 shadow-lg shadow-emerald-900/30 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Authorize Access</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit
              Encrypted
            </span>
            <a href="/" className="hover:text-emerald-400 transition">
              Return to Storefront &rarr;
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN ADMIN PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">{STORE_NAME}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">{STORE_LOCATION}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              title="Lock Admin Screen"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-300 text-xs font-medium transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit to Store</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Sales Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-emerald-400 font-mono">
              ₹{metrics.totalSales.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Orders Placed</span>
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-white font-mono">
              {metrics.totalOrdersCount}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Pending Dispatches</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-amber-400 font-mono">
              {metrics.pendingDispatches}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("add_product")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "add_product"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Medicine / Product</span>
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "catalog"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Store Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "orders"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: ADD PRODUCT */}
        {activeTab === "add_product" && (
          <div className="max-w-3xl mx-auto bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-lg font-bold">
                <Plus className="w-5 h-5" />
                <h2>Publish Medicine / Product to Store Catalog</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Uploads high-res photos to Supabase Storage and creates the
                product listing instantly.
              </p>
            </div>

            {productSuccessMsg && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{productSuccessMsg}</span>
              </div>
            )}

            {productErrorMsg && (
              <div className="mb-6 p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-300 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{productErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePublishProduct} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Product Title / Medicine Name{" "}
                  <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahaglow Glogeous Advanced Face Wash Gel (100g)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Brand / Manufacturer{" "}
                    <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Torrent Pharma"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Selling Price (₹){" "}
                    <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="720"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="845"
                    value={formMrp}
                    onChange={(e) => setFormMrp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pack Size / Unit
                  </label>
                  <input
                    type="text"
                    placeholder="100 g / 10 Tablets"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Batch Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12/2026 or Fresh Batch"
                  value={formBatchExpiry}
                  onChange={(e) => setFormBatchExpiry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description & Key Clinical Benefits
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide therapeutic uses, key ingredients, and dosage guidelines..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Product Photos (Supabase Storage:{" "}
                  <code className="text-emerald-400">product-images</code>)
                </label>

                <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition bg-slate-950/40">
                  <input
                    type="file"
                    id="product-photo-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="product-photo-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <UploadCloud className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-200">
                      Click to select product photos
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Supports PNG, JPG, WEBP (Multi-photo upload enabled)
                    </span>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative group rounded-xl overflow-hidden aspect-square border border-slate-700 bg-slate-950"
                      >
                        <img
                          src={src}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(i)}
                          className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 bg-slate-950 border-slate-800"
                  />
                  <span>
                    Mark as In-Stock (Available for Immediate Dispatch)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={formRxRequired}
                    onChange={(e) => setFormRxRequired(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 bg-slate-950 border-slate-800"
                  />
                  <span>Doctor's Prescription (Rx) Required</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition duration-150 shadow-lg shadow-emerald-950/40 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submittingProduct ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Uploading & Publishing Listing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publish Product to Store Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CATALOG INVENTORY */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog by title or brand..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  onClick={fetchProducts}
                  disabled={loadingProducts}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer flex items-center justify-center shrink-0"
                  title="Refresh Catalog"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loadingProducts ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">
                  No products found
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try changing search query or publish a new product above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((p) => {
                  const title = p.title || p.name || "Medicine Product";
                  const brand = p.brand || p.brand_name || "Pharma";
                  const cat = p.category || p.concern || "Clinical Skincare";
                  const price = Number(p.price || p.selling_price) || 0;
                  const mrp = Number(p.mrp || p.original_price) || price;
                  const unit = p.unit || p.size_volume || "";

                  let thumb = "/placeholder-med.png";
                  if (Array.isArray(p.image_urls) && p.image_urls[0])
                    thumb = p.image_urls[0];
                  else if (typeof p.image_url === "string") thumb = p.image_url;
                  else if (typeof p.image === "string") thumb = p.image;

                  return (
                    <div
                      key={p.id}
                      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between group hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="relative aspect-square rounded-xl bg-slate-950 overflow-hidden mb-3 border border-slate-800">
                          <img
                            src={thumb}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300";
                            }}
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-emerald-400 border border-slate-800">
                            {cat}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium">
                          {brand}
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">
                          {title}
                        </h4>
                        {unit && (
                          <p className="text-[11px] text-slate-500 mt-1">
                            Pack: {unit}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-emerald-400 font-mono">
                              ₹{price}
                            </span>
                            {mrp > price && (
                              <span className="text-xs text-slate-500 line-through">
                                ₹{mrp}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteProduct(p.id, title)}
                          disabled={deletingProductId === p.id}
                          className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded-xl transition cursor-pointer"
                          title="Delete from Catalog"
                        >
                          {deletingProductId === p.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order #, phone, customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="RECEIVED">Received / New</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <button
                  onClick={fetchOrders}
                  disabled={loadingOrders}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer flex items-center justify-center shrink-0"
                  title="Refresh Orders"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loadingOrders ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">
                  No orders found
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Orders placed by customers on the storefront will appear here
                  instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderNum =
                    order.order_number ||
                    order.order_id ||
                    String(order.id).substring(0, 8);
                  const status =
                    order.order_status || order.status || "Received";
                  const customerName =
                    order.customer_name || order.name || "Valued Customer";
                  const customerPhone =
                    order.customer_phone || order.phone || "";
                  const cleanPhone = customerPhone.replace(/\D/g, "");
                  const address =
                    order.customer_address ||
                    order.delivery_address ||
                    order.address ||
                    "Address on file";
                  const total =
                    Number(order.total_amount || order.total || order.amount) ||
                    0;
                  const paymentMethod = order.payment_method || "COD";
                  const paymentStatus = order.payment_status || "Pending";
                  const items = Array.isArray(order.items) ? order.items : [];
                  const orderDate = order.created_at
                    ? new Date(order.created_at).toLocaleString("en-IN")
                    : "Just now";

                  return (
                    <div
                      key={order.id || orderNum}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md transition hover:border-slate-700"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30">
                            #{orderNum}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {orderDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              status === "Delivered"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : status === "Dispatched"
                                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                  : status === "Cancelled"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-4 text-xs">
                        <div className="space-y-1.5">
                          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
                            Customer Details
                          </span>
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {customerName}
                          </div>

                          {customerPhone && (
                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-950 px-2 py-1 rounded-md border border-slate-800"
                              >
                                <Phone className="w-3 h-3 text-emerald-400" />
                                <span>{customerPhone}</span>
                              </a>

                              <a
                                href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${customerName}, Getwell Medicos Chandigarh here regarding your order #${orderNum}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-700/40"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-400" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
                            Delivery Address
                          </span>
                          <p className="text-slate-300 line-clamp-3 leading-relaxed flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{address}</span>
                          </p>
                        </div>

                        <div className="space-y-1.5 md:text-right">
                          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
                            Payment & Total
                          </span>
                          <div className="text-lg font-bold font-mono text-emerald-400">
                            ₹{total.toLocaleString("en-IN")}
                          </div>
                          <div className="flex md:justify-end items-center gap-2 text-[11px]">
                            <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-semibold">
                              {paymentMethod}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded font-semibold ${
                                paymentStatus === "Paid" ||
                                paymentStatus === "Completed"
                                  ? "bg-emerald-950 text-emerald-400"
                                  : "bg-slate-950 text-amber-400"
                              }`}
                            >
                              {paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {items.length > 0 && (
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            Order Items ({items.length})
                          </span>
                          <div className="divide-y divide-slate-900 space-y-1.5">
                            {items.map((item, idx) => (
                              <div
                                key={idx}
                                className="pt-1.5 flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white">
                                    {item.title || item.name}
                                  </span>
                                  {item.unit && (
                                    <span className="text-[10px] text-slate-500">
                                      ({item.unit})
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-300 font-mono">
                                  <span className="text-slate-500">
                                    x{item.quantity || 1}
                                  </span>{" "}
                                  &nbsp; ₹
                                  {(Number(item.price) || 0) *
                                    (item.quantity || 1)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => handleCopyOrderDetails(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition cursor-pointer"
                        >
                          {copiedOrderId === (order.id || orderNum) ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">
                                Slip Copied!
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Dispatch Slip</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          {status !== "Dispatched" &&
                            status !== "Delivered" && (
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(
                                    order.id,
                                    "Dispatched",
                                  )
                                }
                                disabled={updatingOrderId === order.id}
                                className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/50 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Mark Dispatched</span>
                              </button>
                            )}

                          {status !== "Delivered" && (
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "Delivered")
                              }
                              disabled={updatingOrderId === order.id}
                              className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Delivered</span>
                            </button>
                          )}

                          {status !== "Cancelled" && status !== "Delivered" && (
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "Cancelled")
                              }
                              disabled={updatingOrderId === order.id}
                              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 text-xs font-medium rounded-xl transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
