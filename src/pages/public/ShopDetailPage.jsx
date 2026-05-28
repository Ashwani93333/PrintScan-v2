import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Upload, 
  QrCode, 
  FileText, 
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const ShopDetailPage = () => {
  const { slug } = useParams();
  const { shops } = useDb();
  const navigate = useNavigate();

  // Find shop by slug
  const shop = shops.find(s => s.slug === slug);

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="p-4 bg-surface-dark border border-border text-danger rounded-full">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Shop Not Found</h2>
          <p className="text-sm text-muted max-w-sm">The shop slug you are looking for does not exist on the PrintEase network.</p>
          <Link to="/shops" className="px-5 py-2.5 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors">
            Back to Directory
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-muted text-left">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/shops" className="hover:text-white transition-colors">Shops</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold truncate">{shop.name}</span>
          </nav>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
            
            {/* Left 2/3 Content Column */}
            <div className="lg:col-span-8 space-y-6 animate-fade-up">
              {/* Header Details Card */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded bg-success/15 border border-success/20 text-xs text-success font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Currently Open
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-accent/15 border border-accent/20 text-xs text-accent font-semibold font-mono">
                      Verified Partner
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white leading-tight">
                    {shop.name}
                  </h1>
                  
                  <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
                    {shop.description || 'Fast and high-quality document printing service provider. Connect with local shop admins, configure B&W or Color templates, specify stapling details, and get tokens immediately.'}
                  </p>
                </div>

                {/* Specific Contacts Info List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/40 pt-6">
                  <div className="p-4 bg-surface-dark/40 border border-border rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-accent">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">Address</span>
                    </div>
                    <p className="text-xs text-muted font-medium leading-relaxed">{shop.address}</p>
                  </div>

                  <div className="p-4 bg-surface-dark/40 border border-border rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-accent">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">Phone</span>
                    </div>
                    <p className="text-xs text-muted font-medium font-mono">{shop.phone}</p>
                  </div>

                  <div className="p-4 bg-surface-dark/40 border border-border rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-accent">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                    </div>
                    <p className="text-xs text-muted font-medium truncate">{shop.email}</p>
                  </div>
                </div>

                {/* Huge Upload Button */}
                <button
                  onClick={() => navigate(`/shops/${shop.slug}/upload`)}
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-background font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 shadow-xl shadow-accent/5"
                >
                  <Upload className="w-5 h-5" />
                  Upload Files to This Shop Now
                </button>
              </div>
            </div>

            {/* Right 1/3 Requirements & QR Columns */}
            <div className="lg:col-span-4 space-y-6 animate-fade-in stagger-1">
              
              {/* Dynamic QR Code display Card */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-center space-y-4 shadow-xl">
                <div className="bg-surface-dark border border-border rounded-2xl p-4 flex justify-center items-center aspect-square">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                      `${window.location.origin}/shops/${shop.slug}/upload`
                    )}`}
                    alt={`${shop.name} Direct Upload QR Code`}
                    className="w-full max-w-[160px] rounded bg-white p-1 border border-border"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-accent">
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Scan to Upload</span>
                  </div>
                  <p className="text-[10px] text-muted">Scan this counter QR code to upload documents directly to {shop.name} via smartphone.</p>
                </div>
              </div>

              {/* Requirements & Pricing Details Card */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-left space-y-5 shadow-xl">
                <h3 className="text-sm font-serif font-extrabold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  Shop Specifications
                </h3>

                <div className="space-y-3.5 text-xs">
                  {/* Formats */}
                  <div className="space-y-1.5">
                    <span className="text-muted font-semibold block uppercase text-[10px]">Accepted Formats:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {shop.requirements.acceptedFormats.map(fmt => (
                        <span key={fmt} className="px-2 py-1 rounded bg-surface-dark text-[10px] font-bold text-white border border-border">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Page BW Pricing */}
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-muted font-medium">B&W Rate (per page):</span>
                    <span className="font-mono text-white font-bold text-sm">₹{shop.requirements.pricePerPageBW.toFixed(2)}</span>
                  </div>

                  {/* Page Color Pricing */}
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-muted font-medium">Color Rate (per page):</span>
                    <span className="font-mono text-accent font-bold text-sm">₹{shop.requirements.pricePerPageColor.toFixed(2)}</span>
                  </div>

                  {/* File constraints */}
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-muted font-medium">Max File Size:</span>
                    <span className="font-mono text-white font-semibold">{shop.requirements.maxFileSizeMb} MB</span>
                  </div>

                  {/* Max files constraint */}
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-muted font-medium">Max Files Per Job:</span>
                    <span className="font-mono text-white font-semibold">{shop.requirements.maxFilesPerJob} Files</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted bg-surface-dark/40 p-2.5 rounded-lg border border-border/40">
                  <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  <span>Supports dual layouts and duplex orientation options.</span>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 mt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-muted flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} PrintEase. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/shops" className="hover:text-white">Directory</Link>
          <Link to="/" className="hover:text-white">Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default ShopDetailPage;
