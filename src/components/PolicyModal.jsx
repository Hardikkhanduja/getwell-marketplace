// src/components/PolicyModal.jsx
import React from "react";
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  Truck,
  RefreshCw,
  Phone,
  MapPin,
} from "lucide-react";

export default function PolicyModal({ isOpen, onClose, initialTab = "terms" }) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: "terms", label: "Terms & Conditions", icon: FileText },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "shipping", label: "Shipping & Delivery", icon: Truck },
    { id: "refund", label: "Refund & Cancellation", icon: RefreshCw },
    { id: "contact", label: "Contact Us", icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Getwell Medicos — Legal & Store Policies
              </h3>
              <p className="text-xs text-slate-400">
                Booth No. 13, Sector 35C, Chandigarh (160022)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none px-4 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-xs"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-slate-700 text-sm leading-relaxed space-y-6">
          {/* 1. TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                Terms & Conditions of Service
              </h2>
              <p className="text-xs text-slate-500">
                Last updated: September 2026
              </p>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  1. About the Retailer
                </h3>
                <p>
                  This website/platform is operated by{" "}
                  <strong>Getwell Medicos</strong>, a legally registered
                  physical retail pharmacy operating at{" "}
                  <strong>Booth No. 13, Sector 35C, Chandigarh – 160022</strong>
                  . By accessing our platform, adding products to your bag, or
                  making payments, you agree to be bound by these terms.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  2. Prescription & Scheduled Drug Regulations
                </h3>
                <p>
                  In compliance with the <em>Drugs and Cosmetics Act, 1940</em>{" "}
                  and <em>Pharmacy Practice Regulations</em> of India:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>
                    Medicines classified under{" "}
                    <strong>Schedule H, H1, or X</strong> will strictly require
                    a valid digital or physical prescription written by a
                    Registered Medical Practitioner (RMP).
                  </li>
                  <li>
                    Our qualified on-duty pharmacist reserves the right to
                    inspect, verify, and reject any order if the prescription is
                    found expired, illegible, or counterfeit.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  3. Pricing & Minimum Order Value
                </h3>
                <p>
                  All prices listed on the platform are in Indian Rupees (INR)
                  and inclusive of applicable GST. We offer transparent
                  discounts directly off the Maximum Retail Price (MRP).
                </p>
                <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <strong>Minimum Order Value:</strong> A minimum cart value of{" "}
                  <strong>₹199</strong> is required for home delivery orders.
                  Customers desiring single low-value items (e.g., single
                  lozenges or toffees) are warmly invited to purchase them
                  directly across our physical pharmacy counter in Sector 35C.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">4. Payment Terms</h3>
                <p>
                  We accept online payments via{" "}
                  <strong>Razorpay Payment Gateway</strong> (UPI, Google Pay,
                  PhonePe, Debit/Credit Cards, Net Banking) and Cash on Delivery
                  (COD) for eligible Tricity delivery zones. All online
                  transactions are processed through encrypted 256-bit SSL
                  tunnels.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  5. Governing Law & Jurisdiction
                </h3>
                <p>
                  These Terms shall be governed by and constructed in accordance
                  with the laws of the Union of India. Any disputes arising out
                  of or in connection with this platform shall be subject to the
                  exclusive jurisdiction of the competent courts in{" "}
                  <strong>Chandigarh, India</strong>.
                </p>
              </section>
            </div>
          )}

          {/* 2. PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                Privacy & Data Protection Policy
              </h2>
              <p className="text-xs text-slate-500">
                Complying with Information Technology Act, 2000 & SPDI Rules
              </p>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  1. Information We Collect
                </h3>
                <p>
                  To fulfill your healthcare orders and ensure accurate doorstep
                  delivery, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>
                    <strong>Personal Identifiers:</strong> Full Name, Contact
                    Phone Number, and Delivery Address with Pincode.
                  </li>
                  <li>
                    <strong>Health & Order Data:</strong> Prescription copies
                    (if uploaded) and order item history.
                  </li>
                  <li>
                    <strong>Transaction Details:</strong> Razorpay payment
                    identifiers (we <em>never</em> store your card numbers,
                    CVVs, or UPI PINs on our servers).
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  2. How Your Information Is Used
                </h3>
                <p>We strictly utilize your data for:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>
                    Dispatching orders via our pharmacy delivery agents or
                    partner courier services.
                  </li>
                  <li>
                    Sending automated order receipts, tracking updates, and
                    delivery confirmations via WhatsApp or SMS.
                  </li>
                  <li>
                    Compliance with statutory chemist ledger and audit
                    requirements mandated by the Drug Controller of Chandigarh.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  3. Zero Third-Party Selling Guarantee
                </h3>
                <p>
                  Getwell Medicos operates with absolute patient
                  confidentiality. We{" "}
                  <strong>do not sell, rent, trade, or monetize</strong> your
                  medical records, phone numbers, or personal details to
                  third-party telemarketers or ad brokers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  4. Payment Security
                </h3>
                <p>
                  All online payments are securely processed via{" "}
                  <strong>Razorpay</strong>, which is compliant with the highest
                  global security benchmark —{" "}
                  <strong>PCI-DSS Level 1 Certification</strong>.
                </p>
              </section>
            </div>
          )}

          {/* 3. SHIPPING & DELIVERY POLICY */}
          {activeTab === "shipping" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                Shipping & Delivery Policy
              </h2>
              <p className="text-xs text-slate-500">
                Same-Day Local Pharmacy Delivery & Pan-India Courier
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    Chandigarh Tricity Dispatch
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 font-medium">
                    1 to 2 Hours Express Doorstep Delivery
                  </p>
                  <p className="text-xs text-emerald-700 mt-2">
                    Covers Chandigarh (160xxx), Panchkula (134xxx), Mohali,
                    Kharar & Zirakpur (140xxx). Hand-packed by our pharmacist at
                    Sector 35C.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-700" />
                    Pan-India Courier
                  </h4>
                  <p className="text-xs text-blue-800 mt-1 font-medium">
                    3 to 5 Business Days
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    Dispatched via reputed courier partners (Delhivery /
                    BlueDart / SpeedPost) with real-time tracking IDs provided
                    on WhatsApp.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  Delivery Charges & Free Shipping
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>
                    <strong>Orders ₹799 and above:</strong> Enjoy{" "}
                    <strong>FREE Standard Delivery</strong> across all
                    serviceable locations.
                  </li>
                  <li>
                    <strong>Orders below ₹799:</strong> A nominal delivery fee
                    of <strong>₹49</strong> is added to support prompt local
                    rider dispatch.
                  </li>
                  <li>
                    <strong>Minimum Order Value:</strong> Orders must meet the{" "}
                    <strong>₹199 threshold</strong> to qualify for doorstep
                    dispatch.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">Dispatch Timelines</h3>
                <p>
                  Orders received during counter operating hours are processed
                  and packed immediately. Orders placed after closing hours are
                  prioritized for dispatch first thing the next morning.
                </p>
              </section>
            </div>
          )}

          {/* 4. REFUND & CANCELLATION POLICY */}
          {activeTab === "refund" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                Refund, Return & Cancellation Policy
              </h2>
              <p className="text-xs text-slate-500">
                Clear, fair guidelines for returns and refunds
              </p>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  1. Cancellation Policy
                </h3>
                <p>
                  You may cancel your order free of charge at any time{" "}
                  <strong>
                    before the package has left our pharmacy counter for
                    delivery
                  </strong>
                  . To cancel, please immediately call our dispatch desk at{" "}
                  <strong>+91 9872633001</strong>. Once a rider is out for
                  delivery, cancellations may not be permitted.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  2. Returns & Replacements (7-Day Policy)
                </h3>
                <p>
                  Due to pharmaceutical safety, hygiene, and temperature-control
                  regulations, medicines once opened cannot be re-stocked.
                  However, we offer an immediate replacement or full refund
                  under the following conditions:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>
                    Item delivered was damaged, leaking, or past its expiration
                    date.
                  </li>
                  <li>
                    Incorrect product or dosage was delivered compared to your
                    invoice.
                  </li>
                  <li>
                    Reported within <strong>7 days</strong> of delivery with a
                    photo of the received package.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  3. Refund Timeline & Processing
                </h3>
                <p>Upon approval of your return/cancellation:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>
                    <strong>Online Payments (Razorpay/UPI/Cards):</strong>{" "}
                    Refund will be credited back to your original payment method
                    within <strong>3 to 5 business days</strong>.
                  </li>
                  <li>
                    <strong>Cash on Delivery (COD):</strong> Refunds will be
                    instantly transferred via UPI (GPay/PhonePe/Paytm) to the
                    customer's provided mobile number or bank account.
                  </li>
                </ul>
              </section>
            </div>
          )}

          {/* 5. CONTACT US */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                Contact Us & Grievance Redressal
              </h2>
              <p className="text-xs text-slate-500">
                Visit our physical pharmacy counter or reach our helpline
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <MapPin className="w-4 h-4" /> Physical Store Address
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    Getwell Medicos
                  </p>
                  <p className="text-xs text-slate-600">
                    Booth No. 13, Sector 35C Market,
                    <br />
                    Chandigarh – 160022, India
                  </p>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    (Opposite Sector 35 Inner Market parking)
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Phone className="w-4 h-4" /> Pharmacist & Helplines
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Primary Helpline:</strong> +91 9872633001
                  </p>
                  <p className="text-xs text-slate-700">
                    <strong>Support / WhatsApp:</strong> +91 9988604013
                  </p>
                  <div className="text-xs text-slate-600 pt-1">
                    <p className="font-semibold text-slate-800">Store Hours:</p>
                    <p>Mon – Sat: 9:00 AM to 9:00 PM</p>
                    <p className="text-emerald-700 font-medium">
                      Sunday: 10:00 AM to 3:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mt-4 text-xs text-emerald-900">
                <p className="font-bold mb-1">
                  Grievance & Customer Support Officer
                </p>
                <p>
                  For any escalations, order inquiries, or payment
                  reconciliations, please reach us directly via call/WhatsApp at{" "}
                  <strong>+91 9872633001</strong>. All customer concerns are
                  addressed within 12 business hours.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Getwell Medicos • Certified Retail Chemist</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
