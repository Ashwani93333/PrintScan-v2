import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { 
  Plus, 
  ArrowLeft, 
  Store, 
  User, 
  Sliders, 
  Building2, 
  ShieldCheck, 
  CheckSquare, 
  ChevronRight 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';

const SuperCreateShop = () => {
  const { createShop } = useDb();
  const navigate = useNavigate();

  // Form states
  const [shopName, setShopName] = useState('');
  const [slug, setSlug] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  // Admin Account info
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Requirements info
  const [priceBW, setPriceBW] = useState(2.0);
  const [priceColor, setPriceColor] = useState(10.0);
  const [maxSize, setMaxSize] = useState(25);
  const [maxFiles, setMaxFiles] = useState(5);
  const [formats, setFormats] = useState({
    PDF: true,
    JPG: true,
    PNG: true,
    DOCX: true
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isPending, setIsPending] = useState(false);

  // Auto-generate slug URL from name
  useEffect(() => {
    const generated = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
  }, [shopName]);

  const handleFormatsChange = (key) => {
    setFormats(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedFormats = Object.keys(formats).filter(k => formats[k]);
    if (selectedFormats.length === 0) {
      setToastType('error');
      setToastMessage('Please select at least one accepted file format.');
      return;
    }

    setIsPending(true);

    setTimeout(() => {
      const response = createShop({
        name: shopName,
        address,
        phone,
        email,
        slug,
        description,
        adminName,
        adminEmail,
        pricePerPageBW: parseFloat(priceBW),
        pricePerPageColor: parseFloat(priceColor),
        maxFileSizeMb: parseInt(maxSize),
        maxFilesPerJob: parseInt(maxFiles),
        acceptedFormats: selectedFormats
      });

      setIsPending(false);

      if (response.success) {
        setToastType('success');
        setToastMessage(`Shop "${shopName}" created and activated!`);
        setTimeout(() => {
          navigate('/superadmin/shops');
        }, 1200);
      } else {
        setToastType('error');
        setToastMessage(response.error || 'Failed to manually create shop.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar isSuper={true} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col text-left relative">
        
        {/* Toast Feedback notifications */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 animate-scale-in">
            <Toast 
              message={toastMessage} 
              type={toastType} 
              onClose={() => setToastMessage('')} 
            />
          </div>
        )}

        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <div className="flex items-center gap-4">
            <Link 
              to="/superadmin/shops" 
              className="p-1.5 hover:bg-surface-dark border border-transparent hover:border-border rounded-lg text-muted hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg font-serif font-extrabold text-white">Manual Provision Shop</h1>
          </div>
          <span className="text-xs text-muted">Platform Provisioning</span>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 animate-fade-up">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-muted">
              <Link to="/superadmin/dashboard" className="hover:text-white">Admin</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/superadmin/shops" className="hover:text-white">Shops</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-semibold">Provision Shop</span>
            </nav>

            {/* Section 1: Shop details */}
            <div className="bg-surface-ink border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-md">
              <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-accent" />
                1. Shop Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Shop Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Print Hub"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                  />
                </div>
                
                {/* Generated Slug Url */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Shop URL Slug *</label>
                  <input
                    type="text"
                    placeholder="e.g. metro-print-hub"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-'))}
                    required
                  />
                  <span className="text-[10px] text-accent font-semibold block truncate">
                    URL: <span className="underline font-mono">printease.com/shops/{slug}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Shop Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 12345 67890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Shop Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. admin@printhub.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-muted font-semibold">Physical Address *</label>
                <input
                  type="text"
                  placeholder="e.g. 45 MG Road, Connaught Place, New Delhi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs text-muted font-semibold">Shop Description</label>
                <textarea
                  rows="3"
                  placeholder="Service summary description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Section 2: Owner/Admin account details */}
            <div className="bg-surface-ink border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-md">
              <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-accent" />
                2. Admin Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Manager Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajiv Khanna"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Manager Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. manager@printease.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-surface-dark/40 border border-border/60 rounded-xl text-[10px] text-muted flex gap-2 items-start leading-relaxed">
                <ShieldCheck className="w-4.5 h-4.5 text-success flex-shrink-0" />
                <span>
                  Admin Created shops are automatically approved and activated immediately. Standard default password for shop administrators is set to <span className="text-white font-mono font-bold">Password123!</span>.
                </span>
              </div>
            </div>

            {/* Section 3: Requirements & Rates */}
            <div className="bg-surface-ink border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-md">
              <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-accent" />
                3. Pricing Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">B&W Print Rate (per page) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">₹</span>
                    <input
                      type="number"
                      step="0.05"
                      value={priceBW}
                      onChange={(e) => setPriceBW(parseFloat(e.target.value) || 0)}
                      className="pl-8 w-full"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Color Print Rate (per page) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">₹</span>
                    <input
                      type="number"
                      step="0.05"
                      value={priceColor}
                      onChange={(e) => setPriceColor(parseFloat(e.target.value) || 0)}
                      className="pl-8 w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Max File Size Limit (MB) *</label>
                  <input
                    type="number"
                    min="1"
                    value={maxSize}
                    onChange={(e) => setMaxSize(parseInt(e.target.value) || 25)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Max Files Per Job *</label>
                  <input
                    type="number"
                    min="1"
                    value={maxFiles}
                    onChange={(e) => setMaxFiles(parseInt(e.target.value) || 5)}
                    required
                  />
                </div>
              </div>

              {/* Checkboxes selection file formats */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs text-muted font-semibold">Accepted Document Formats *</label>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(formats).map(key => (
                    <label 
                      key={key} 
                      className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer text-xs font-semibold select-none transition-colors ${
                        formats[key]
                          ? 'bg-accent/15 border-accent text-accent'
                          : 'bg-surface-dark border-border text-muted hover:text-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formats[key]}
                        onChange={() => handleFormatsChange(key)}
                        className="hidden"
                      />
                      {key}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-accent hover:bg-accent-hover disabled:bg-accent/40 text-background font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 shadow-xl"
            >
              <Plus className="w-5 h-5 font-bold" />
              {isPending ? 'Transmitting details...' : 'Manually Create & Activate Shop Partner'}
            </button>

          </form>
        </main>
      </div>

    </div>
  );
};

export default SuperCreateShop;
