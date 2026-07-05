import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Building2, 
  UserCheck, 
  Coins, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Info,
  ShieldCheck,
  TrendingUp,
  Percent,
  Smile
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const RegisterShopPage = () => {

  // Step state
  const [step, setStep] = useState(1);

  // Step 1: Shop details
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Admin credentials
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Auto-generate slug
  useEffect(() => {
    if (step === 1) {
      const generated = shopName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  }, [shopName, step]);



  const nextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!shopName.trim() || !address.trim() || !phone.trim() || !email.trim() || !slug.trim()) {
        setErrorMsg('Please complete all required fields.');
        return;
      }
      // Email format validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMsg('Please enter a valid shop email address.');
        return;
      }
      // Slug format validation
      if (!/^[a-z0-9-]+$/.test(slug)) {
        setErrorMsg('Slug can only contain lowercase letters, numbers, and hyphens.');
        return;
      }
    }
    if (step === 2) {
      if (!adminName.trim() || !adminEmail.trim() || !password || !confirmPassword) {
        setErrorMsg('Please complete all account fields.');
        return;
      }
      // Admin email format validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
        setErrorMsg('Please enter a valid admin email address.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setErrorMsg('Password must contain at least one uppercase letter.');
        return;
      }
      if (!/[0-9]/.test(password)) {
        setErrorMsg('Password must contain at least one number.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    setIsPending(true);

    try {
      await api.registerShop({
        name: shopName,
        address,
        phone,
        email,
        slug,
        description,
        adminName,
        adminEmail,
        password
      });
      setRegisteredEmail(adminEmail);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit registration request.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 2/3 Form Screen */}
            <div className="lg:col-span-8 bg-surface-ink border border-border rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
              {!submitted ? (
                /* Registration Multi-Step Form */
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                  <div className="space-y-2 border-b border-border/40 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">Register Your Print Shop</h1>
                    <p className="text-xs text-muted">Join the PrintEase cloud. Grow local business and optimize document printing.</p>
                  </div>

                  {/* Horizontal progress steps indicators */}
                  <div className="flex items-center gap-2 py-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${step >= 1 ? 'bg-accent text-background border-accent' : 'bg-surface-dark text-muted border-border'}`}>01</span>
                    <span className="w-8 border-t border-border"></span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${step >= 2 ? 'bg-accent text-background border-accent' : 'bg-surface-dark text-muted border-border'}`}>02</span>
                  </div>

                  {/* Form Error Banners */}
                  {errorMsg && (
                    <div className="p-4 bg-danger/10 border border-danger/25 text-xs font-semibold text-danger rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  {/* STEP 1: Shop information */}
                  {step === 1 && (
                    <div className="space-y-4 animate-scale-in">
                      <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-border/20 pb-2">
                        <Building2 className="w-4.5 h-4.5 text-accent" />
                        Step 1 — Shop Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Shop Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Campus Quick Print"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            required
                          />
                        </div>
                        
                        {/* Interactive Slug generator & url preview */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Shop Slug (URL Endpoint) *</label>
                          <input
                            type="text"
                            placeholder="e.g. campus-quick-print"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-'))}
                            required
                          />
                          <span className="text-[10px] text-accent font-semibold block truncate">
                            Your URL: <span className="underline font-mono">printease.com/shops/{slug || 'slug'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Shop Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Shop Email Address *</label>
                          <input
                            type="email"
                            placeholder="e.g. contact@campusquickprint.com"
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
                          placeholder="e.g. 123 University Ave, Sector 4, New Delhi"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs text-muted font-semibold">Public Shop Description</label>
                        <textarea
                          rows="3"
                          placeholder="Provide a brief summary of what services you offer..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Account details */}
                  {step === 2 && (
                    <div className="space-y-4 animate-scale-in">
                      <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-border/20 pb-2">
                        <UserCheck className="w-4.5 h-4.5 text-accent" />
                        Step 2 — Admin Credentials
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Full Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Rajiv Khanna"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Admin Username/Email *</label>
                          <input
                            type="email"
                            placeholder="e.g. owner@printease.com"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Password *</label>
                          <input
                            type="password"
                            placeholder="Password must be min 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs text-muted font-semibold">Confirm Password *</label>
                          <input
                            type="password"
                            placeholder="Match password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-surface-dark/40 border border-border/60 rounded-xl flex gap-2.5 text-[10px] text-muted items-start">
                        <Info className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>These credentials will be used to access your Shop Admin dashboard immediately after super-admin approval.</span>
                      </div>
                    </div>
                  )}



                  {/* Navigation trigger button bar */}
                  <div className="flex justify-between gap-3 pt-4 border-t border-border/40 mt-6">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-surface-dark border border-border text-white hover:bg-primary/20 transition-all flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous Step
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {step < 2 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-accent text-background hover:bg-accent-hover transition-all flex items-center gap-1.5 ml-auto"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-5 py-2.5 text-sm font-bold rounded-xl bg-accent text-background hover:bg-accent-hover disabled:bg-accent/40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 ml-auto shadow-xl"
                      >
                        {isPending ? 'Transmitting request...' : 'Submit Registration Request →'}
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* Application Submitted - Success Pending State */
                <div className="text-center space-y-6 py-10 animate-scale-in">
                  <div className="flex justify-center">
                    <div className="p-4 bg-accent/15 text-accent rounded-full border border-accent/25 animate-pulse-subtle">
                      <CheckCircle className="w-14 h-14" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-extrabold text-white">Registration Submitted!</h1>
                    <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                      Your shop configuration is under review. Our team will verify your details and notify you at <span className="text-white font-semibold">{registeredEmail}</span> within 24-48 hours.
                    </p>
                  </div>

                  <div className="p-4 bg-surface-dark border border-border rounded-2xl max-w-sm mx-auto flex gap-3 text-xs text-muted leading-relaxed text-left">
                    <Info className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>
                      Demo Mode Shortcut: You can log in as Super Admin (`superadmin@printease.com` / `SuperAdmin123!`) to approve this shop instantly!
                    </span>
                  </div>

                  <div className="pt-2 flex justify-center gap-3 max-w-xs mx-auto">
                    <Link
                      to="/"
                      className="flex-1 py-3 text-xs font-semibold bg-accent text-background hover:bg-accent-hover rounded-xl text-center shadow-lg transition-colors"
                    >
                      Go Home
                    </Link>
                    <Link
                      to="/login"
                      className="flex-1 py-3 text-xs font-semibold bg-surface-dark border border-border text-white hover:bg-primary/20 rounded-xl text-center transition-colors"
                    >
                      Login Panel
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right 1/3 Side Benefit Columns */}
            <div className="lg:col-span-4 space-y-6 text-left animate-fade-in stagger-1">
              
              {/* Benefits sidebar card */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-5 shadow-xl">
                <h3 className="text-base font-serif font-extrabold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Why Join PrintEase?
                </h3>

                <div className="space-y-4">
                  {/* B1 */}
                  <div className="flex gap-3">
                    <div className="p-2 bg-surface-dark border border-border text-accent rounded-xl h-fit">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">Instant QR Uploads</h4>
                      <p className="text-[10px] text-muted">A branded custom QR code placed at your counter handles document collection automatically.</p>
                    </div>
                  </div>

                  {/* B2 */}
                  <div className="flex gap-3">
                    <div className="p-2 bg-surface-dark border border-border text-accent rounded-xl h-fit">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">Full Pricing Autonomy</h4>
                      <p className="text-[10px] text-muted">Change page prices, formats, and file limitations in your admin settings panel instantly.</p>
                    </div>
                  </div>

                  {/* B3 */}
                  <div className="flex gap-3">
                    <div className="p-2 bg-surface-dark border border-border text-accent rounded-xl h-fit">
                      <Smile className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">Zero Account Setup Required</h4>
                      <p className="text-[10px] text-muted">Customers upload files and pay counter-directly without logging into any system.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative testimonial placeholder card */}
              <div className="p-5 bg-surface-ink border border-border rounded-3xl space-y-3.5 shadow-xl relative overflow-hidden">
                <span className="text-4xl text-accent/10 font-serif absolute -top-1 left-2 select-none">“</span>
                <p className="text-xs text-muted italic leading-relaxed pt-2">
                  PrintEase reduced our counter stapling errors by 80%. Students scan the QR, upload directly, and collect in 2 minutes. Outstanding!
                </p>
                <div className="space-y-0.5 text-left border-t border-border/40 pt-2.5">
                  <span className="text-[10px] font-bold text-white block">Ashish Sharma</span>
                  <span className="text-[9px] text-accent block">Manager, Campus Quick Print</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 mt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-muted">
        <p>&copy; {new Date().getFullYear()} PrintEase SaaS network.</p>
      </footer>
    </div>
  );
};

export default RegisterShopPage;
