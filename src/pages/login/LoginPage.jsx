import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Printer, Eye, EyeOff, ShieldAlert, KeyRound, Mail, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsPending(true);

    // Dynamic login execution simulation
    setTimeout(() => {
      const response = login(email, password);
      setIsPending(false);

      if (response.success) {
        if (response.role === 'SUPER_ADMIN') {
          navigate('/superadmin/dashboard');
        } else if (response.role === 'ADMIN') {
          navigate('/admin/dashboard');
        }
      } else {
        setErrorMsg(response.error || 'Invalid credentials.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      
      {/* Left split brand panel (Decorative) */}
      <div className="lg:flex lg:w-1/2 bg-surface-ink border-r border-border p-12 flex-col justify-between text-left relative overflow-hidden hidden">
        {/* Decorative dot background texture */}
        <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent opacity-60"></div>
        
        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-2 group relative z-10">
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg group-hover:bg-accent/20 transition-all">
            <Printer className="w-6 h-6 text-accent animate-pulse-subtle" />
          </div>
          <span className="text-2xl font-serif font-extrabold text-white tracking-tight">
            Print<span className="text-accent text-glow-amber">Ease</span>
          </span>
        </Link>

        {/* Dynamic center visuals */}
        <div className="space-y-6 max-w-md relative z-10 animate-fade-up">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">MANAGEMENT TERMINAL v2.0</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            Optimize Your Counter.
          </h2>
          <p className="text-base text-muted leading-relaxed">
            Sign in to access your administrative operations panel. Manage dynamic rates, approve pending jobs, calculate estimated cost parameters, and coordinate print orientations.
          </p>
        </div>

        {/* Footer label */}
        <div className="relative z-10 text-xs text-muted">
          &copy; {new Date().getFullYear()} PrintEase. Enterprise Cloud.
        </div>
      </div>

      {/* Right split form panel (Login Form) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md bg-surface-ink border border-border p-8 rounded-3xl space-y-6 shadow-2xl text-left animate-scale-in">
          
          {/* Mobile brand branding */}
          <div className="flex items-center gap-2 lg:hidden mb-4 justify-center">
            <Printer className="w-5 h-5 text-accent" />
            <span className="text-xl font-serif font-extrabold text-white">
              Print<span className="text-accent text-glow-amber">Ease</span>
            </span>
          </div>

          <div className="space-y-1.5 text-center lg:text-left">
            <h2 className="text-2xl font-serif font-extrabold text-white">Welcome Back</h2>
            <p className="text-xs text-muted">Sign in to manage your local print shop queue.</p>
          </div>

          {/* Core authorization error banners */}
          {errorMsg && (
            <div className="p-3.5 bg-danger/10 border border-danger/25 text-xs font-semibold text-danger rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs text-muted font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. owner@printease.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-muted font-semibold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Password
                </label>
                <Link to="/login" className="text-[10px] text-accent hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit signin action */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-accent/40 text-background font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-150 pt-3"
            >
              {isPending ? 'Authenticating credentials...' : 'Sign In'}
            </button>

          </form>

          {/* Demo account notes banner */}
          <div className="p-3 bg-surface-dark border border-border/80 rounded-xl space-y-1 text-[10px] text-muted leading-relaxed">
            <span className="text-accent font-bold uppercase block tracking-wider">Demo Credentials:</span>
            <div className="flex flex-col gap-1">
              <p>• Shop Admin: <span className="text-white font-mono font-bold">owner@printease.com</span> / <span className="text-white font-mono font-bold">Password123!</span></p>
              <p>• Super Admin: <span className="text-white font-mono font-bold">superadmin@printease.com</span> / <span className="text-white font-mono font-bold">SuperAdmin123!</span></p>
            </div>
          </div>

          <hr className="border-border/60" />

          <div className="text-center text-xs text-muted">
            Don't have a shop yet?{' '}
            <Link to="/register" className="text-accent hover:underline font-bold inline-flex items-center gap-0.5">
              Register here
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
