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
  Printer,
  Image,
  FileText,
  MessageCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import PricingSection from '../../components/pricing/PricingSection';

const TiltCard = ({ children, className }) => {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  return (
    <div
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [slugInput, setSlugInput] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSlugSubmit = (e) => {
    e.preventDefault();
    if (slugInput.trim()) {
      navigate(`/shops/${slugInput.trim().toLowerCase()}`);
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
              <span>20+ shops | 1000+ prints daily | Shop revenue</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-[1.1] tracking-tight">
              Your Documents.<br />
              <span className="text-accent text-glow-amber">Printed Instantly.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Upload files from anywhere, configure your printing preferences in a click, track your jobs in real-time, and collect them at any PrintEase partner shop near you.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col pt-4 w-full max-w-md">
              <label className="text-sm text-white font-medium mb-2 block">
                Enter shop slug to upload files directly...
              </label>
              {/* Upload to Shop Quick Input */}
              <form onSubmit={handleSlugSubmit} className="relative flex items-center shadow-lg shadow-accent/10 rounded-xl">
                <input
                  type="text"
                  placeholder="e.g. campus-quick-print"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  className="w-full pr-14 pl-5 py-4 text-base bg-surface-ink/80 backdrop-blur-sm border-2 border-border focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-xl text-white placeholder:text-muted transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 p-3 rounded-lg bg-accent text-background hover:bg-accent-hover hover:scale-105 active:scale-95 transition-all duration-150"
                  title="Go to Upload Page"
                >
                  <UploadCloud className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-5 flex justify-center relative animate-fade-in stagger-1 perspective-[1000px]">
            {/* Soft glow behind the card */}
            <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 rounded-full scale-75 animate-pulse-subtle"></div>
            
            <TiltCard className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col z-10 transform transition-transform duration-500">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50/80">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm font-semibold text-slate-400">Live Dashboard</span>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                
                {/* Job #33 */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-emerald-700 font-extrabold text-lg">#33</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="text-slate-700 font-bold text-sm">DBMS notes.pdf</span>
                      </div>
                      <div className="flex gap-2 text-[10px] font-bold">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">24pgs</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-md">Color</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-500 rounded-md">+3 more files</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#16b38a] text-white text-sm font-bold rounded-lg shadow-md shadow-[#16b38a]/20 hover:bg-[#139c78] transition-colors">
                    Print
                  </button>
                </div>

                {/* Job #32 */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-emerald-700 font-extrabold text-lg">#32</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Image className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-700 font-bold text-sm">Admit Card.jpg</span>
                      </div>
                      <div className="flex gap-2 text-[10px] font-bold">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">1pg</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">B&W</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#16b38a] text-white text-sm font-bold rounded-lg shadow-md shadow-[#16b38a]/20 hover:bg-[#139c78] transition-colors">
                    Print
                  </button>
                </div>

                {/* Skeleton Loader */}
                <div className="flex items-center justify-between pt-2 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-40 bg-slate-100 rounded-full animate-pulse"></div>
                      <div className="h-2.5 w-24 bg-slate-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-slate-100 rounded-lg animate-pulse"></div>
                </div>

              </div>
            </TiltCard>
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
                <h3 className="text-lg font-serif font-bold text-white">Enter Shop Handle</h3>3
                <p className="text-sm text-muted">
                  Know your print shop's unique handle? Enter it directly to jump straight into their upload portal.
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
                  Receive a token number to track status. Collect from counter as soon as status indicates ready.
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

      {/* Recent Jobs Section */}
      <section className="bg-surface-ink border-y border-border py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-serif font-extrabold text-white">Recent Uploded Files</h2>
            {/* <p className="text-sm text-muted">Hover over the cards to see the tilt animation in action.</p> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Physics_Notes_Ch4.pdf', pages: 12, type: 'Color', status: 'Completed' },
              { name: 'Project_Proposal_Final.docx', pages: 5, type: 'B&W', status: 'Processing' },
              { name: 'Event_Flyer_Draft.png', pages: 1, type: 'Color', status: 'Pending' },
              { name: 'Lab_Report_2026.pdf', pages: 8, type: 'B&W', status: 'Completed' },
            ].map((job, idx) => (
              <TiltCard key={idx} className="bg-surface-dark border border-border p-6 rounded-2xl cursor-pointer shadow-lg flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-background rounded-xl border border-border text-accent group-hover:bg-accent/10 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                      job.status === 'Completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      job.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2 truncate" title={job.name}>{job.name}</h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted mt-auto pt-4 border-t border-border/50">
                  <span>{job.pages} Pages</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

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
                      <span className="font-mono text-white font-semibold">Job #1</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">PENDING</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/40">
                      <span className="font-mono text-white font-semibold">Job #2</span>
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
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Left - Logo */}
            <div className="flex items-center gap-2 w-full md:w-1/3 justify-center md:justify-start">
              <img src="/printease-logo.jpeg" alt="PrintEase Logo" className="w-8 h-8 rounded-md object-cover" />
              <span className="text-base font-serif font-extrabold text-white tracking-tight">
                Print<span className="text-accent text-glow-amber">Ease</span>
              </span>
            </div>
            
            {/* Middle - Social Icons */}
            <div className="flex gap-4 text-muted w-full md:w-1/3 justify-center">
              <a href="https://instagram.com/printease455" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors p-2 bg-surface-ink rounded-full border border-border hover:border-accent/50"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="https://www.linkedin.com/in/ashwani-kumar-128240383/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors p-2 bg-surface-ink rounded-full border border-border hover:border-accent/50"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
              <a href="mailto:printease455@gmail.com" className="hover:text-accent transition-colors p-2 bg-surface-ink rounded-full border border-border hover:border-accent/50"><Mail className="w-4 h-4" /></a>
              <a href="https://wa.me/7303028574" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors p-2 bg-surface-ink rounded-full border border-border hover:border-accent/50"><MessageCircle className="w-4 h-4" /></a>
            </div>
            
            {/* Right - Links */}
            <div className="flex items-center gap-6 text-sm text-muted w-full md:w-1/3 justify-center md:justify-end">
              <div className="relative">
                <button 
                  onClick={() => setIsContactOpen(!isContactOpen)}
                  className={`transition-colors duration-200 ${isContactOpen ? 'text-accent' : 'hover:text-white'}`}
                >
                  Contact Support
                </button>
                {isContactOpen && (
                  <div className="absolute bottom-full mb-4 right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 w-64 bg-surface-dark border border-border rounded-xl shadow-2xl p-4 animate-fade-in z-50 text-left">
                    <h4 className="text-sm font-semibold text-white mb-3 border-b border-border pb-2">Support Details</h4>
                    <div className="space-y-3 text-xs text-muted">
                      <a href="https://wa.me/7303028574" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>7303028574</span>
                      </a>
                      <a href="mailto:printease455@gmail.com" className="flex items-center gap-3 hover:text-accent transition-colors">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">printease455@gmail.com</span>
                      </a>
                      <a href="https://instagram.com/printease455" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        <span>printease455</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>

          </div>

          <div className="mt-12 text-center border-t border-border/50 pt-8">
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} PrintEase SaaS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
