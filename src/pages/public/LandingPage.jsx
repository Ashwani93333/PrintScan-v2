import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  UploadCloud, 
  Compass, 
  Clock, 
  MapPin, 
  BadgeAlert, 
  ShieldCheck, 
  Coins, 
  Mail, 
  FileCheck, 
  ArrowRight,
  TrendingUp,
  Printer
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      navigate(`/track/${tokenInput.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Next-Gen Document Printing on Demand</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-[1.1] tracking-tight">
              Your Documents.<br />
              <span className="text-accent text-glow-amber">Printed Instantly.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Upload files from anywhere, configure your printing preferences in a click, track your jobs in real-time, and collect them at any PrintEase partner shop near you.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/shops"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-background hover:bg-accent-hover font-semibold text-sm shadow-xl shadow-accent/5 hover:scale-[1.02] active:scale-95 transition-all duration-150"
              >
                <Search className="w-4 h-4" />
                Find a Print Shop Near You
              </Link>
              
              {/* Live Track Quick Input */}
              <form onSubmit={handleTrackSubmit} className="relative flex-1 max-w-sm flex items-center">
                <input
                  type="text"
                  placeholder="Enter Job Token (e.g. E9A4F8)..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full pr-12 text-sm bg-surface-ink border border-border focus:border-accent rounded-xl"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 p-2 rounded-lg bg-surface-dark border border-border text-accent hover:text-white transition-colors duration-150"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in stagger-1">
            <div className="relative w-full max-w-sm aspect-square bg-surface-ink border border-border rounded-3xl p-8 flex flex-col justify-center items-center overflow-hidden shadow-2xl">
              {/* Decorative radial background */}
              <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent opacity-60"></div>
              
              {/* Abstract Industrial Printing press SVG illustration */}
              <svg className="w-40 h-40 text-accent/80 mb-6 drop-shadow-[0_0_15px_rgba(232,168,56,0.15)] animate-pulse-subtle" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Paper feeds */}
                <rect x="25" y="10" width="50" height="20" rx="3" fill="#1E2435" stroke="currentColor" strokeWidth="2" />
                <line x1="35" y1="20" x2="65" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                
                {/* Rollers */}
                <circle cx="50" cy="55" r="16" stroke="currentColor" strokeWidth="3" />
                <path d="M30 55 H70" stroke="currentColor" strokeWidth="2" />
                <circle cx="34" cy="55" r="3" fill="currentColor" />
                <circle cx="66" cy="55" r="3" fill="currentColor" />
                
                {/* Printed page output */}
                <rect x="30" y="65" width="40" height="25" rx="2" fill="#0F1117" stroke="currentColor" strokeWidth="2" />
                <line x1="38" y1="73" x2="62" y2="73" stroke="currentColor" strokeWidth="1.5" />
                <line x1="38" y1="78" x2="56" y2="78" stroke="currentColor" strokeWidth="1.5" />
                <line x1="38" y1="83" x2="60" y2="83" stroke="currentColor" strokeWidth="1.5" />
                
                {/* Floating QR grid dot representation */}
                <rect x="74" y="25" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.3" />
                <rect x="18" y="60" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
              </svg>
              
              <div className="text-center space-y-1">
                <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">PRINTEASE CLOUD v2.0</span>
                <h4 className="text-sm font-serif font-semibold text-white">Continuous Print Dispatch</h4>
                <p className="text-xs text-muted">Stapled, bound, color, and double-sided routing.</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-surface-ink border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-serif font-extrabold text-white">How It Works</h2>
            <p className="text-sm text-muted">Three simple industrial-grade operational phases to get your papers physically ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-surface-dark border border-border p-6 rounded-2xl relative hover:border-accent/30 transition-all duration-200">
              <span className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-accent text-background font-mono font-bold text-xs">01</span>
              <div className="mt-2 space-y-3">
                <div className="p-3 w-fit bg-background rounded-xl border border-border text-accent">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">Find Your Shop</h3>
                <p className="text-sm text-muted">
                  Search by area or browse active local shops. View requirements, prices, and accepted formats.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-dark border border-border p-6 rounded-2xl relative hover:border-accent/30 transition-all duration-200">
              <span className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-accent text-background font-mono font-bold text-xs">02</span>
              <div className="mt-2 space-y-3">
                <div className="p-3 w-fit bg-background rounded-xl border border-border text-accent">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">Upload Your Files</h3>
                <p className="text-sm text-muted">
                  Drop PDFs, JPGs, or DOCX files. Toggle double-sided layouts, B&W or Color options, and print copies.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-dark border border-border p-6 rounded-2xl relative hover:border-accent/30 transition-all duration-200">
              <span className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-accent text-background font-mono font-bold text-xs">03</span>
              <div className="mt-2 space-y-3">
                <div className="p-3 w-fit bg-background rounded-xl border border-border text-accent">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">Track & Collect</h3>
                <p className="text-sm text-muted">
                  Receive a custom 6-character token to track status. Collect from counter as soon as status indicates ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-serif font-extrabold text-white">Features Built for Execution</h2>
          <p className="text-sm text-muted">Equipped with custom indicators, live tracking queues, and fully automated estimations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* F1 */}
          <div className="p-6 bg-surface-ink border border-border rounded-xl flex gap-4 hover:border-border/10 transition-colors">
            <div className="p-2.5 bg-surface-dark rounded-xl border border-border text-accent h-fit">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-serif font-bold text-white">Real-Time Tracking</h4>
              <p className="text-xs text-muted">Live job queues let you see exactly where your paper is in the printer stepper.</p>
            </div>
          </div>

          {/* F2 */}
          <div className="p-6 bg-surface-ink border border-border rounded-xl flex gap-4 hover:border-border/10 transition-colors">
            <div className="p-2.5 bg-surface-dark rounded-xl border border-border text-accent h-fit">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-serif font-bold text-white">QR Code Integrations</h4>
              <p className="text-xs text-muted">Walk up, scan, drag-drop from your smartphone, and sit back without creating any account.</p>
            </div>
          </div>

          {/* F3 */}
          <div className="p-6 bg-surface-ink border border-border rounded-xl flex gap-4 hover:border-border/10 transition-colors">
            <div className="p-2.5 bg-surface-dark rounded-xl border border-border text-accent h-fit">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-serif font-bold text-white">Multi-Format Files</h4>
              <p className="text-xs text-muted">Full cloud validation for PDFs, JPGs, PNGs, and Microsoft Word DOCX formats.</p>
            </div>
          </div>

          {/* F4 */}
          <div className="p-6 bg-surface-ink border border-border rounded-xl flex gap-4 hover:border-border/10 transition-colors">
            <div className="p-2.5 bg-surface-dark rounded-xl border border-border text-accent h-fit">
              <Coins className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-serif font-bold text-white">Instant Cost Estimator</h4>
              <p className="text-xs text-muted">Real-time dynamic page-multiplier calculations derived from custom shop rates.</p>
            </div>
          </div>

          {/* F5 */}
          <div className="p-6 bg-surface-ink border border-border rounded-xl flex gap-4 hover:border-border/10 transition-colors">
            <div className="p-2.5 bg-surface-dark rounded-xl border border-border text-accent h-fit">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-serif font-bold text-white">Email & Notifications</h4>
              <p className="text-xs text-muted">Keep updated in full automatically without constantly refreshing the live tab.</p>
            </div>
          </div>

          {/* F6 */}
          <div className="p-6 bg-surface-ink border border-border rounded-xl flex gap-4 hover:border-border/10 transition-colors">
            <div className="p-2.5 bg-surface-dark rounded-xl border border-border text-accent h-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-serif font-bold text-white">Secure Storage</h4>
              <p className="text-xs text-muted">Fully encrypted file handling system. Printed documents are deleted on job collections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Shop Owners Section */}
      <section className="bg-surface-ink border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Owner text */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white leading-tight">
                Grow Your Print Business with PrintEase
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Connect with hundreds of students and local customers needing instant print jobs. Eliminate the friction of emails, USB drives, and manual cash handovers. Get a custom branded QR code for your shop counter!
              </p>
              
              <ul className="space-y-3.5 text-sm text-white font-medium">
                <li className="flex items-center gap-3">
                  <span className="p-1 rounded-full bg-accent/20 text-accent"><ShieldCheck className="w-3.5 h-3.5" /></span>
                  Automated queues & customer status notifications
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-1 rounded-full bg-accent/20 text-accent"><ShieldCheck className="w-3.5 h-3.5" /></span>
                  Control pricing per page (Color vs B&W) dynamically
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-1 rounded-full bg-accent/20 text-accent"><ShieldCheck className="w-3.5 h-3.5" /></span>
                  Platform-wide dashboard analytics & approvals
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background hover:bg-accent-hover font-semibold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-150"
                >
                  Register Your Shop — It's Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Owner visual panel */}
            <div className="lg:col-span-6">
              <div className="bg-surface-dark border border-border rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-xs font-mono text-muted">printease.com/admin/dashboard</span>
                </div>
                
                {/* Styled placeholder card representing dashboard mock screenshot */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-surface-ink border border-border rounded-xl text-left">
                    <span className="text-[10px] text-muted block font-medium">Total Jobs</span>
                    <span className="text-lg font-bold text-white block">142</span>
                  </div>
                  <div className="p-3 bg-surface-ink border border-border rounded-xl text-left">
                    <span className="text-[10px] text-muted block font-medium">Pending</span>
                    <span className="text-lg font-bold text-accent block">5</span>
                  </div>
                  <div className="p-3 bg-surface-ink border border-border rounded-xl text-left">
                    <span className="text-[10px] text-muted block font-medium">Earnings</span>
                    <span className="text-lg font-bold text-success block">₹4,230</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-ink border border-border rounded-xl text-left space-y-3">
                  <h4 className="text-xs font-mono text-accent uppercase tracking-widest font-bold">Realtime Job Queue</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/40">
                      <span className="font-mono text-white font-semibold">Job #E9A4F8</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">PENDING</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/40">
                      <span className="font-mono text-white font-semibold">Job #B3K9X2</span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">PROCESSING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-accent" />
            <span className="text-base font-serif font-extrabold text-white tracking-tight">
              Print<span className="text-accent text-glow-amber">Ease</span>
            </span>
          </div>
          
          <div className="flex gap-6 text-xs text-muted">
            <Link to="/shops" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/shops" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:support@printease.com" className="hover:text-white transition-colors">Contact Support</a>
          </div>

          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} PrintEase SaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
