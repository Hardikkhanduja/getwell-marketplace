# 🏥 Getwell Medicos -> D2C Pharmacy Marketplace & Store Operations Hub

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Live%20Gateway-0C2340?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Green--API](https://img.shields.io/badge/Green--API-Dual%20WhatsApp%20Alerts-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://green-api.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Production%20Deployment-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)]()

A high-performance, full-stack D2C pharmaceutical and clinical skincare marketplace built specifically for **Getwell Medicos** (*Booth No. 13, Sector 35C, Chandigarh - 160022*). 

Engineered with a luxury healthcare design language, integrated dual payment gateways (Razorpay + COD), automated serverless WhatsApp dispatch alerts, and a standalone, PIN-secured Store Operations Hub.

---

## 🌟 Live Production Links

* **Live Storefront:** https://getwell-marketplace.vercel.app/

---

## 📑 Table of Contents

- [Key Architecture](#-key-architecture)
- [Feature Breakdown](#-feature-breakdown)
  - [1. Consumer Storefront](#1-consumer-storefront)
  - [2. Cart & Zero-Friction Checkout](#2-cart--zero-friction-checkout)
  - [3. Dual Automated WhatsApp Notifications](#3-dual-automated-whatsapp-notifications)
  - [4. PIN-Secured Store Operations Hub](#4-pin-secured-store-operations-hub)
- [Logistics & Fulfillment Engine](#-logistics--fulfillment-engine)
- [Database Schema (Supabase PostgreSQL)](#-database-schema-supabase-postgresql)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables (.env)](#-environment-variables-env)
- [Local Development & Setup](#-local-development--setup)
- [Deployment (Vercel)](#-deployment-vercel)
- [Security & Compliance](#-security--compliance)

---

## ⚡ Key Architecture

```
Customer Storefront ──► Live Supabase Catalog & PDP Lightbox
        │
        ├──► Dynamic Cart (₹199 Min Order • ₹799 Free Delivery)
        │
        └──► Razorpay Live / Cash on Delivery Checkout
                    │
                    ├──► 1. Saves Order to Supabase Database (`orders` table)
                    │
                    ├──► 2. Triggers Vercel Serverless Function (`api/send-order-alert.js`)
                    │         └──► Green-API WhatsApp Dual Alert
                    │               ├── Father: +91 9872633001
                    │               └── Son:    +91 9988604013
                    │
                    └──► 3. Realtime Sync in PIN-Secured Admin Portal (`/admin`)
                              ├── 1-Click Order Status Updates (Dispatched / Delivered)
                              ├── Multi-Photo Upload to Supabase Storage Bucket
                              └── Realtime Catalog Deletion & Stock Toggle
```

---

## 🚀 Feature Breakdown

### 1. Consumer Storefront
* **Luxury Clinical Aesthetic:** Emerald-accented UI, sleek typography, micro-animations, and verified trust badges (*100% Genuine Pharmacy*, *Cold-Chain Storage*, *5.0★ Google Rating*).
* **Instant Live Autocomplete:** Real-time search dropdown attached to the search bar with instant pricing and 1-click "Add to Bag".
* **Segmented Category Navigation:** Apple-style category bar (*Clinical Skincare*, *Baby Care*, *Daily Wellness*, *Hair Care*, *Prescription & OTC*, *Oral Care*, *First Aid*).
* **Multi-Attribute Filters:** Filter catalog dynamically by brand and price range with instant badge resets.
* **Rich Product Detail Lightbox (PDP):**
  * Multi-photo gallery carousel.
  * 2.2x cursor magnifier lens for reading fine-print packaging and medicine formulations.
  * Pack size/unit indicators, batch expiry date, and verified MRP discount tags.
* **Friction-Free WhatsApp Prescription (Rx) Modal:** Instant 1-tap connection to store pharmacist via WhatsApp with prefilled message formatting.

### 2. Cart & Zero-Friction Checkout
* **Non-Clipping Drawer Architecture:** Fixed sticky top header, isolated scroll container for items, and sticky checkout summary.
* **Business Threshold Enforcements:**
  * **Minimum Order Value (MOV):** ₹199 minimum order enforcement.
  * **Free Shipping Progress Bar:** Real-time progress tracker towards ₹799 free shipping threshold (₹49 standard delivery fee).
* **Dual Payment Gateway:**
  * **Razorpay Live Gateway:** Automated UPI intent (Google Pay, PhonePe, Paytm), Netbanking, and Credit/Debit Cards.
  * **Cash on Delivery (COD):** Direct local dispatch with phone verification.

### 3. Dual Automated WhatsApp Notifications
* Powered by a secure serverless Vercel function (`api/send-order-alert.js`) interfacing with **Green-API**.
* Fires automated WhatsApp messages simultaneously to both store owners upon checkout:
  * **Father (Store Counter):** `+91 XXXXXXXXXX`
  * **Son (Operations):** `+91 9988604013`
* Message payload includes Order #ID, Customer Name, Phone, Full Delivery Address, Payment Mode, Itemized List, and Total Payable.

### 4. PIN-Secured Store Operations Hub
* **Access Point:** `https://getwell-marketplace.vercel.app/?admin ` or `/admin`.
* **Security Layer:** 4-digit PIN lock screen (`3500` / `9872`), with 256-bit session caching.
* **Realtime KPI Dashboard:**
  * Total Sales Volume (₹)
  * Total Orders Placed
  * Pending Dispatches Counter
* **Customer Orders Tab:**
  * Realtime order polling and manual refresh.
  * Search by Order ID, Phone, Customer Name, or Address.
  * Filter by status (*Received*, *Dispatched*, *Delivered*, *Cancelled*).
  * 1-Click Order Status Toggles (updates Supabase database instantly).
  * 1-Tap Customer WhatsApp Chat & Phone dialer.
  * 1-Click "Copy Dispatch Slip" for printing or packing.
* **Store Catalog Tab:**
  * Live catalog search and category filtering.
  * 1-Click permanent product deletion with safety confirmation modal.
* **+ Add New Medicine / Product Tab:**
  * Multi-photo uploader uploading directly to Supabase Storage bucket (`product-images`).
  * Fields: Title, Brand, Category, Selling Price, MRP (auto-computes discount %), Unit/Pack Size, Batch Expiry, Clinical Description, In-Stock toggle, and Rx Required toggle.

---

## 🚚 Logistics & Fulfillment Engine

The platform operates on a dual-stream logistics model:

| Fulfillment Stream | Target Geography | Delivery SLA | Partner / Method |
| :--- | :--- | :--- | :--- |
| **Hyperlocal Tricity Stream** | Chandigarh, Mohali, Panchkula (`1600xx`, `1400xx`, `1340xx`) | **90 Minutes** | Rapido Express / Local Rider Dispatch |
| **Pan-India Courier Stream** | Rest of India | **2 - 4 Business Days** | Speed Post / Bluedart Air Courier |

---

## 🗄 Database Schema (Supabase PostgreSQL)

### 1. `orders` Table
```sql
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  order_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  delivery_address TEXT,
  pincode TEXT,
  city TEXT,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  order_status TEXT DEFAULT 'Received',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public updates" ON public.orders FOR UPDATE USING (true);
```

### 2. `products` Table
```sql
CREATE TABLE public.products (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  name TEXT,
  brand TEXT NOT NULL,
  brand_name TEXT,
  category TEXT NOT NULL,
  concern TEXT,
  price NUMERIC(10,2) NOT NULL,
  selling_price NUMERIC(10,2),
  mrp NUMERIC(10,2) NOT NULL,
  unit TEXT DEFAULT 'Standard Pack',
  size_volume TEXT,
  batch_expiry TEXT DEFAULT 'Fresh Batch',
  description TEXT,
  image_urls TEXT[] DEFAULT '{}',
  image_url TEXT,
  image TEXT,
  is_in_stock BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  prescription_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.products FOR DELETE USING (true);
CREATE POLICY "Allow public update" ON public.products FOR UPDATE USING (true);
```

### 3. Supabase Storage Bucket
* **Bucket ID:** `product-images`
* **Public Access:** Enabled (`true`)

---

## 🛠 Tech Stack

* **Frontend Framework:** React 18, Vite 5
* **Styling & Icons:** Vanilla CSS, Tailwind CSS utilities, Lucide React
* **Database & Auth:** Supabase (PostgreSQL, Realtime, Storage)
* **Payment Processing:** Razorpay Standard Checkout SDK
* **Notifications:** Green-API (WhatsApp Instance Gateway)
* **Hosting & Serverless:** Vercel (Edge Network + Serverless Functions)

---

## 📂 Project Directory Structure

```
getwell-marketplace/
├── api/
│   └── send-order-alert.js          # Serverless Dual WhatsApp Dispatcher (Green-API)
├── public/
│   ├── favicon.ico
│   └── whatsapp.png                 # Official 3D WhatsApp Asset
├── src/
│   ├── components/
│   │   ├── AdminOrdersPortal.jsx    # PIN-Secured Store Operations Hub
│   │   ├── CartDrawer.jsx           # Slide-out cart with MOV & free shipping meter
│   │   ├── CheckoutModal.jsx        # Razorpay + COD payment gateway modal
│   │   ├── Footer.jsx               # Regulatory compliance footer & store details
│   │   ├── Header.jsx               # Live autocomplete search & navigation bar
│   │   ├── Hero.jsx                 # Store banner, trust metrics & Rx CTA
│   │   ├── PolicyModal.jsx          # RBI/Razorpay compliant legal policies
│   │   ├── PrescriptionModal.jsx    # WhatsApp prescription order lightbox
│   │   ├── ProductCard.jsx          # Catalog card with price/discount badges
│   │   └── ProductModal.jsx         # PDP lightbox with 2.2x zoom magnifier
│   ├── data/
│   │   └── mockProducts.js          # Offline fallback catalog data
│   ├── lib/
│   │   └── supabase.js              # Supabase Client Initialization
│   ├── App.jsx                      # Root application & isolated /admin routing
│   ├── index.css                    # Design tokens & typography styling
│   └── main.jsx                     # Application entrypoint
├── index.html                       # HTML5 Shell & Razorpay SDK injection
├── package.json                     # Dependencies & scripts
├── vercel.json                      # Single Page Application (SPA) routing rules
└── vite.config.js                   # Vite bundler configuration
```

---

## 🔑 Environment Variables (.env)

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Razorpay Payment Gateway (Live Key)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx

# Admin Operations Portal Security PINs (Comma-separated)
VITE_ADMIN_PIN=XXXX

# Server-Side WhatsApp Dispatcher (Vercel Environment Variables)
GREEN_API_ID_INSTANCE=XXXXXXXX
GREEN_API_TOKEN_INSTANCE=your-green-api-token-instance
```

---

## 💻 Local Development & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/getwell-marketplace.git
   cd getwell-marketplace
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create `.env` file in the root directory with your Supabase and Razorpay credentials.

4. **Start Vite Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` for the customer storefront or `http://localhost:5173/?admin=true` for the Operations Hub.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🚀 Deployment (Vercel)

The repository is pre-configured with `vercel.json` for client-side routing.

1. Push code to your GitHub repository.
2. Import repository into [Vercel Dashboard](https://vercel.com).
3. Set **Framework Preset** to `Vite`.
4. Add all environment variables in **Project Settings > Environment Variables**.
5. Click **Deploy**.

---

## 🛡 Security & Compliance

* **Server-Side Token Isolation:** Green-API secret tokens are confined to the `api/send-order-alert.js` serverless function and never exposed to the client bundle.
* **RBI & Payment Gateway Compliance:** Fully accessible Terms of Service, Privacy Policy, Shipping Policy, Refund/Cancellation Policy, and physical store contact details.
* **PIN Authentication:** Admin Operations Hub is protected by PIN barrier with local session encryption.

---

## 🏢 Store Location & Physical Operations

**Getwell Medicos**  
📍 Booth No. 13, Sector 35C, Chandigarh – 160022  
📞 Counter Phone: `+91 9988604013`  
🕒 Physical Counter Hours: Mon – Sat (9:00 AM – 9:00 PM) | Sun (10:00 AM – 2:00 PM)

---

## 📄 License

Proprietary © 2026 **Getwell Medicos**. All rights reserved.
