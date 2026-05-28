import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDb } from '../../context/DbContext';
import { Store, Save, Sliders, CheckSquare, ShieldCheck, Mail, Phone, Info, QrCode, Download, Copy, Printer, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';

const AdminProfile = () => {
  const { user } = useAuth();
  const { shops, updateShopProfile } = useDb();

  // Find shop
  const shopId = user?.shopId || "a90b4d45-ff1a-4643-982c-d9c087b322a3";
  const shop = shops.find(s => s.id === shopId);

  // States
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Requirements states
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

  // Load shop data
  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setAddress(shop.address);
      setPhone(shop.phone);
      setEmail(shop.email);
      setDescription(shop.description || '');
      setIsActive(shop.isActive);
      
      setPriceBW(shop.requirements.pricePerPageBW);
      setPriceColor(shop.requirements.pricePerPageColor);
      setMaxSize(shop.requirements.maxFileSizeMb);
      setMaxFiles(shop.requirements.maxFilesPerJob);

      // Rebuild formats dictionary
      const currentFormats = { PDF: false, JPG: false, PNG: false, DOCX: false };
      shop.requirements.acceptedFormats.forEach(fmt => {
        if (currentFormats[fmt] !== undefined) {
          currentFormats[fmt] = true;
        }
      });
      setFormats(currentFormats);
    }
  }, [shop]);

  const handleFormatsChange = (key) => {
    setFormats(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const [copied, setCopied] = useState(false);
  const shopUrl = shop ? `${window.location.origin}/shops/${shop.slug}` : '';

  const handleCopyLink = () => {
    if (!shopUrl) return;
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setToastType('success');
    setToastMessage('Shop URL link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    if (!shopUrl) return;
    setToastType('info');
    setToastMessage('Generating high resolution QR code...');
    try {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shopUrl)}`;
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${shop?.slug || 'printease-shop'}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setToastType('success');
      setToastMessage('QR Code downloaded successfully!');
    } catch (error) {
      console.error(error);
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shopUrl)}`, '_blank');
      setToastType('success');
      setToastMessage('Opened QR Code in a new tab. Right-click to save!');
    }
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>PrintEase Counter Poster - ${shop?.name}</title>
          <style>
            body {
              font-family: 'Sora', 'Arial', sans-serif;
              text-align: center;
              padding: 40px;
              color: #1A2035;
              background-color: #ffffff;
            }
            .container {
              border: 4px dashed #1A2035;
              padding: 40px;
              max-width: 500px;
              margin: 0 auto;
              border-radius: 24px;
            }
            h1 {
              font-size: 32px;
              margin-bottom: 5px;
              color: #1A2035;
            }
            p {
              font-size: 16px;
              color: #8A8FA3;
              margin-bottom: 30px;
            }
            .qr-container {
              margin: 20px auto;
              width: 250px;
              height: 250px;
              padding: 10px;
              border: 2px solid #E8A838;
              border-radius: 16px;
            }
            img {
              width: 100%;
              height: 100%;
            }
            .footer-text {
              margin-top: 30px;
              font-size: 14px;
              font-weight: bold;
              color: #E8A838;
              letter-spacing: 1px;
            }
            .brand {
              margin-top: 20px;
              font-size: 18px;
              font-weight: 800;
              color: #1A2035;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="brand">Print<span style="color:#E8A838">Ease</span></div>
            <h1>${shop?.name}</h1>
            <p>Scan to Upload & Print Documents Instantly</p>
            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shopUrl)}" />
            </div>
            <p class="footer-text">POWERED BY PRINTEASE PLATFORM</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedFormats = Object.keys(formats).filter(k => formats[k]);
    if (selectedFormats.length === 0) {
      setToastType('error');
      setToastMessage('Please select at least one accepted file format.');
      return;
    }

    updateShopProfile(shopId, {
      name,
      address,
      phone,
      email,
      description,
      isActive,
      acceptedFormats: selectedFormats,
      pricePerPageBW: parseFloat(priceBW),
      pricePerPageColor: parseFloat(priceColor),
      maxFileSizeMb: parseInt(maxSize),
      maxFilesPerJob: parseInt(maxFiles)
    });

    setToastType('success');
    setToastMessage('Shop profile changes saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar isSuper={false} />

      {/* Main Content Panel */}
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
          <h1 className="text-lg font-serif font-extrabold text-white">Configure Shop Profile</h1>
          <span className="text-xs text-muted font-bold font-mono">ID: {shopId.substring(0, 8)}</span>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form: Shop Details */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
              
              {/* Section 1: Public info */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-md">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  <Store className="w-4.5 h-4.5 text-accent" />
                  Shop Information
                </h3>

                {/* Grid fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Shop Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Active status Toggle switch */}
                  <div className="flex items-center justify-between p-3.5 bg-surface-dark border border-border rounded-xl mt-auto">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white block">Active Status</span>
                      <span className="text-[10px] text-muted block">Current: {isActive ? 'OPEN (Accepting Jobs)' : 'CLOSED (Hidden)'}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isActive} 
                        onChange={(e) => setIsActive(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-surface-ink peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent peer-checked:after:bg-background"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Shop Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Shop Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Physical Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted font-semibold">Public Shop Description</label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 2: Requirements & Rates */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-md">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-accent" />
                  Rates & Restrictions
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">B&W Print Rate (per page)</label>
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
                    <label className="text-xs text-muted font-semibold">Color Print Rate (per page)</label>
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
                    <label className="text-xs text-muted font-semibold">Max File Size Limit (MB)</label>
                    <input
                      type="number"
                      min="1"
                      value={maxSize}
                      onChange={(e) => setMaxSize(parseInt(e.target.value) || 25)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Max Files Per Job</label>
                    <input
                      type="number"
                      min="1"
                      value={maxFiles}
                      onChange={(e) => setMaxFiles(parseInt(e.target.value) || 5)}
                      required
                    />
                  </div>
                </div>

                {/* Checkbox group accepted file formats */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs text-muted font-semibold flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-accent" />
                    Accepted Document Formats
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(formats).map(key => (
                      <label 
                        key={key} 
                        className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl cursor-pointer text-xs font-semibold select-none transition-colors ${
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

              {/* Save Profile Button */}
              <button
                type="submit"
                className="w-full py-4 bg-accent hover:bg-accent-hover text-background font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 shadow-xl"
              >
                <Save className="w-5 h-5" />
                Save Profile Changes
              </button>

            </form>

            {/* Right Column: Counter QR Code Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-center space-y-5 shadow-md">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3 flex items-center justify-center gap-2">
                  <QrCode className="w-4.5 h-4.5 text-accent" />
                  Shop Counter QR
                </h3>

                <div className="bg-surface-dark border border-border rounded-2xl p-4 flex flex-col items-center justify-center aspect-square relative group">
                  {shopUrl ? (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shopUrl)}`}
                      alt="Shop QR Code"
                      className="w-44 h-44 rounded-lg bg-white p-2 border border-border shadow-inner"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-muted">Generating QR...</div>
                  )}
                  <div className="absolute inset-0 bg-background/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                    <button 
                      onClick={handleDownloadQR}
                      className="px-4 py-2 bg-accent hover:bg-accent-hover text-background text-xs font-bold rounded-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download High Res
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Customer Scan URL</span>
                    <div className="flex items-center gap-1.5 bg-surface-dark border border-border rounded-xl p-2.5 font-mono text-[10px] text-white">
                      <span className="truncate flex-1">{shopUrl || 'Generating link...'}</span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="text-accent hover:text-white transition-colors p-1 rounded hover:bg-surface-ink border border-transparent hover:border-border"
                        title="Copy link"
                      >
                        {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="w-full py-2.5 bg-surface-dark hover:bg-surface-dark/70 border border-border hover:border-accent/40 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4 text-accent" />
                      Download QR Code Image (.png)
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintQR}
                      className="w-full py-2.5 bg-surface-dark hover:bg-surface-dark/70 border border-border hover:border-accent/40 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Printer className="w-4 h-4 text-accent" />
                      Print Counter Poster
                    </button>
                  </div>
                  
                  <div className="p-3 bg-surface-dark/40 border border-border rounded-xl flex gap-2.5 text-[10px] text-muted leading-relaxed">
                    <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p>Place this QR code at your checkout counter. When customers scan it, they will go directly to your shop page, configure settings, upload documents, and their files will land in your active jobs queue automatically.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminProfile;
