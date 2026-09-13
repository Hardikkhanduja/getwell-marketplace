import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminProductModal({ isOpen, onClose, onProductSaved, onProductDeleted, currentProducts }) {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State for New / Edited Product
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [brandName, setBrandName] = useState('Cetaphil');
  const [concern, setConcern] = useState('Clinical Skincare');
  const [sizeVolume, setSizeVolume] = useState('');
  const [mrp, setMrp] = useState('');
  const [price, setPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('12/2026');
  const [imageUrl, setImageUrl] = useState('');
  const [benefitsStr, setBenefitsStr] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [isBestseller, setIsBestseller] = useState(false);

  // Default Master PIN is set to 3500 (Sector 35) or customizable
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '3500' || pin === '9872') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Store PIN. Please enter your 4-digit code (default: 3500).');
    }
  };

  // Image Upload to Supabase Storage
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!supabase) {
      alert('Supabase is not configured in .env. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (publicUrlData && publicUrlData.publicUrl) {
        setImageUrl(publicUrlData.publicUrl);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Could not upload to "product-images" bucket. Please ensure the bucket exists and is set to Public in Supabase.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Product to Supabase
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Please fill product title and selling price.');
      return;
    }

    if (!supabase) {
      alert('Supabase client is not connected.');
      return;
    }

    try {
      setLoading(true);

      const benefits = benefitsStr
        ? benefitsStr.split('\n').map((s) => s.trim()).filter(Boolean)
        : [];

      const keyIngredients = ingredientsStr
        ? ingredientsStr.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const newProductPayload = {
        title,
        subtitle,
        brand_name: brandName,
        concern,
        size_volume: sizeVolume,
        mrp: mrp ? parseFloat(mrp) : parseFloat(price),
        price: parseFloat(price),
        expiry_date: expiryDate,
        image_url: imageUrl || '/Cetaphil-Gentle.png',
        benefits,
        key_ingredients: keyIngredients,
        is_bestseller: isBestseller,
        in_stock: true,
        rating: 4.9,
        reviews_count: 50,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([newProductPayload])
        .select();

      if (error) throw error;

      alert('Product published live to Supabase!');
      onProductSaved(data[0]);

      // Reset form
      setTitle('');
      setSubtitle('');
      setSizeVolume('');
      setMrp('');
      setPrice('');
      setImageUrl('');
      setBenefitsStr('');
      setIngredientsStr('');
      setActiveTab('list');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Error saving product to Supabase: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Product from Supabase
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product from the live website?')) return;

    if (!supabase) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      onProductDeleted(id);
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Toggle Stock
  const handleToggleStock = async (product) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !product.inStock })
        .eq('id', product.id);

      if (error) throw error;
      product.inStock = !product.inStock;
      onProductSaved(product);
    } catch (err) {
      alert('Error updating stock: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors"
          aria-label="Close admin"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* PIN Security View */}
        {!isAuthenticated ? (
          <div className="py-8 text-center max-w-sm mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#071610] text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Getwell Store Admin</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter your 4-digit store PIN to manage catalog inventory.
              </p>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-3 pt-2">
              <input
                type="password"
                maxLength="4"
                required
                placeholder="Enter PIN (e.g. 3500)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-lg tracking-widest bg-[#faf9f5] border border-gray-300 rounded-xl p-3 font-mono focus:outline-none focus:ring-2 focus:ring-[#071610]"
              />
              <button
                type="submit"
                className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Unlock Admin Access
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Supabase Live Database
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Product Inventory Manager</h2>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Live Catalog ({currentProducts.length})
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'add'
                      ? 'bg-[#071610] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  + Add Product
                </button>
              </div>
            </div>

            {/* TAB 1: PRODUCT LIST */}
            {activeTab === 'list' ? (
              <div className="mt-4 divide-y divide-gray-100 max-h-[60vh] overflow-y-auto pr-1">
                {currentProducts.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-xs">
                    No products in database yet. Click "+ Add Product" to publish one!
                  </div>
                ) : (
                  currentProducts.map((p) => {
                    const img = p.images && p.images.length > 0 ? p.images[0] : p.image;
                    return (
                      <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                        <img
                          src={img}
                          alt={p.name}
                          className="w-12 h-12 object-contain bg-[#faf9f5] border border-gray-200 rounded-lg p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            <span className="font-semibold text-[#071610]">&#8377;{p.price}</span>
                            <span>&bull;</span>
                            <span>{p.brand}</span>
                            {p.expiryDate && (
                              <>
                                <span>&bull;</span>
                                <span className="text-emerald-700">Exp: {p.expiryDate}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              p.inStock !== false
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            title="Delete from Supabase"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            ) : (
              /* TAB 2: ADD NEW PRODUCT FORM */
              <form onSubmit={handleSaveProduct} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cetaphil Gentle Skin Cleanser (250ml)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cetaphil, Dot & Key"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Concern / Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Dry & Sensitive Skin"
                      value={concern}
                      onChange={(e) => setConcern(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Size / Volume</label>
                    <input
                      type="text"
                      placeholder="e.g. 250 ml, 50 g"
                      value={sizeVolume}
                      onChange={(e) => setSizeVolume(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">MRP (&#8377;)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="440"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price (&#8377;) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="395"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold text-[#071610] focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 12/2026"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    />
                  </div>
                </div>

                {/* Image Upload or Direct URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Product Photo (Upload or Paste URL)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#071610] file:text-white hover:file:bg-[#1a382b] cursor-pointer"
                    />
                    {uploadingImage && <span className="text-xs text-emerald-700 animate-pulse">Uploading to Supabase...</span>}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste direct image URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full mt-2 bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Short Description / Subtitle
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Dermatologist-recommended gentle soap-free cleanser for dry to normal skin."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Key Ingredients (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Niacinamide, Panthenol, Glycerin"
                      value={ingredientsStr}
                      onChange={(e) => setIngredientsStr(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Benefits (1 per line)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Non-irritating & soap-free&#10;Maintains skin barrier"
                      value={benefitsStr}
                      onChange={(e) => setBenefitsStr(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#071610]"
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="bestseller"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 accent-[#071610] rounded cursor-pointer"
                  />
                  <label htmlFor="bestseller" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Highlight as Bestseller / Featured Product
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="w-full bg-[#071610] hover:bg-[#1a382b] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Publishing to Supabase...' : 'Publish Product to Live Website'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}