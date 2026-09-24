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
  Mail,
  AlertTriangle,
} from "lucide-react";

export default function PolicyModal({
  isOpen,
  onClose,
  defaultTab = "terms",
  initialTab = "terms",
}) {
  const activeInitial = defaultTab || initialTab || "terms";
  const [activeTab, setActiveTab] = React.useState(activeInitial);

  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [defaultTab, initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: "terms", label: "Terms & Conditions", icon: FileText },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "shipping", label: "Shipping & Delivery", icon: Truck },
    { id: "refund", label: "Refund & Cancellation", icon: RefreshCw },
    { id: "contact", label: "Contact Us", icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl">
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
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Pure Clean, No Ugly Scrollbar */}
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="flex border-b border-slate-200 bg-slate-50/90 overflow-x-auto px-4 pt-2 shrink-0 select-none [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-emerald-600 text-emerald-700 bg-white rounded-t-2xl shadow-xs"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Single Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-slate-700 text-sm leading-relaxed space-y-6">
          {/* 1. TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Terms & Conditions of Service
              </h2>
              <p className="text-xs text-slate-400">
                Last updated: September 2026
              </p>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  1. About the Retailer
                </h3>
                <p>
                  This website/platform is operated by{" "}
                  <strong>Getwell Medicos</strong>, a licensed physical retail
                  pharmacy operating at{" "}
                  <strong>Booth No. 13, Sector 35C, Chandigarh – 160022</strong>
                  . By accessing our platform, adding products to your bag, or
                  placing orders, you agree to be bound by these terms.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  2. Prescription & Scheduled Drug Regulations
                </h3>
                <p>
                  In strict compliance with the{" "}
                  <em>Drugs and Cosmetics Act, 1940</em> and{" "}
                  <em>Pharmacy Practice Regulations</em> of India:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>
                    Medicines classified under{" "}
                    <strong>Schedule H, H1, or X</strong> require a valid
                    digital or physical prescription written by a Registered
                    Medical Practitioner (RMP).
                  </li>
                  <li>
                    Our qualified on-duty pharmacist reserves the right to
                    inspect, verify, and reject any order if the prescription is
                    expired or counterfeit.
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
                <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                  <strong>Minimum Order Value:</strong> A minimum cart value of{" "}
                  <strong>₹199</strong> is required for home delivery orders.
                  Single low-value items are warmly available for in-person
                  counter pickup.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">4. Payment Terms</h3>
                <p>
                  We accept online payments via{" "}
                  <strong>Razorpay Payment Gateway</strong> (UPI, Google Pay,
                  PhonePe, Debit/Credit Cards, Net Banking) and Cash on Delivery
                  (COD) for eligible Tricity delivery zones. All transactions
                  are protected by 256-bit encryption.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  5. Governing Law & Jurisdiction
                </h3>
                <p>
                  These Terms shall be governed by and construed in accordance
                  with the laws of the Union of India. Any disputes shall be
                  subject to the exclusive jurisdiction of the competent courts
                  in <strong>Chandigarh, India</strong>.
                </p>
              </section>
            </div>
          )}

          {/* 2. PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Privacy & Data Protection Policy
              </h2>
              <p className="text-xs text-slate-400">
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
                    identifiers (we <em>never</em> store card numbers, CVVs, or
                    UPI PINs on our servers).
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
                    Statutory compliance mandated by the Drug Controller of
                    Chandigarh.
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
                  All online transactions are securely processed via{" "}
                  <strong>Razorpay</strong>, which is compliant with the highest
                  global security benchmark —{" "}
                  <strong>PCI-DSS Level 1 Certification</strong>.
                </p>
              </section>
            </div>
          )}

          {/* 3. SHIPPING & DELIVERY POLICY */}
          {activeTab === "shipping" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Shipping & Delivery Policy
              </h2>
              <p className="text-xs text-slate-400">
                Same-Day Local Pharmacy Delivery & Pan-India Courier
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" /> Tricity
                    Express Dispatch
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Delivered in <strong>1–2 Hours</strong> across Chandigarh,
                    Mohali, Panchkula & Zirakpur directly from Sector 35C.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" /> Pan-India
                    Standard Shipping
                  </h4>
                  <p className="text-xs text-blue-800 mt-1">
                    Delivered in <strong>2–4 Business Days</strong> via India
                    Post Speed Post / Bluedart with tracking.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  Shipping Fees & Free Delivery Threshold
                </h3>
                <p className="text-xs text-slate-600">
                  • Orders of <strong>₹799 and above</strong> receive{" "}
                  <strong>100% Free Doorstep Delivery</strong>.<br />• Orders
                  below ₹799 incur a nominal delivery fare of ₹49.
                </p>
              </section>
            </div>
          )}

          {/* 4. REFUND & CANCELLATION */}
          {activeTab === "refund" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Refund & Cancellation Policy
              </h2>
              <p className="text-xs text-slate-400">
                Transparent & Hassle-Free Returns
              </p>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  1. Cancellation by Customer
                </h3>
                <p>
                  You may cancel your order free of charge at any time{" "}
                  <strong>before dispatch</strong> by calling our store hotline
                  (+91 9872633001) or messaging our official WhatsApp.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  2. 7-Day Replacement / Return Guarantee
                </h3>
                <p>
                  If an item arrives damaged, expired, defective, or incorrect,
                  notify us within <strong>7 days of delivery</strong> for an
                  immediate free replacement or 100% refund.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">
                  3. Refund Processing Timelines
                </h3>
                <p>
                  Approved refunds are returned to your original payment method
                  (Bank Account, UPI, or Card) within{" "}
                  <strong>3 to 5 business days</strong> via Razorpay.
                </p>
              </section>
            </div>
          )}

          {/* 5. CONTACT US */}
          {activeTab === "contact" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Contact Us & Store Coordinates
              </h2>
              <p className="text-xs text-slate-400">
                Official Retailer & Grievance Information
              </p>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm">
                      Physical Pharmacy Counter:
                    </strong>
                    <p className="text-slate-600 mt-0.5">
                      Booth No. 13, Sector 35C, Chandigarh – 160022, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Phone Helplines:</strong>
                    <p className="text-slate-600 mt-0.5">
                      <a
                        href="tel:+919872633001"
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        +91 9872633001
                      </a>{" "}
                      /{" "}
                      <a
                        href="tel:+919988604013"
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        +91 9988604013
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Working Hours:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Monday to Sunday: 9:00 AM – 9:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition cursor-pointer"
          >
            Close Policies
          </button>
        </div>
      </div>
    </div>
  );
}
