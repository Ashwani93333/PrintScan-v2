import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Printer, User, LogOut, ShieldAlert, MessageCircle, Mail, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Track My Print', path: '/track/1' }, // Mocking tracking link placeholder
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Icon */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/printease-logo.jpeg" alt="PrintEase Logo" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xl font-serif font-extrabold text-text-primary tracking-tight">
                Print<span className="text-accent text-glow-amber">Ease</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  if (link.path.startsWith('/#') && location.pathname === '/') {
                    e.preventDefault();
                    const id = link.path.split('#')[1];
                    const element = document.getElementById(id);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-accent border-b border-accent pb-1' 
                    : 'text-muted hover:text-text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Panel (Auth & Actions) */}
          <div className="hidden md:flex items-center gap-4">
            <a href="https://maps.app.goo.gl/mK4Tu4jduiumxGB7A?g_st=aw" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-surface-ink border border-border hover:border-accent/40 rounded-lg text-xs font-semibold text-text-primary transition-all">
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Find us on Google
            </a>
            
            {/* Theme Toggle Desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted hover:text-text-primary hover:bg-surface-dark border border-transparent hover:border-border transition-all duration-150"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Dynamic Role Badge */}
                <Link
                  to={user.role === 'SUPER_ADMIN' ? '/superadmin/dashboard' : '/admin/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary border border-border hover:border-accent/40 text-xs font-semibold text-white transition-all duration-200"
                >
                  {user.role === 'SUPER_ADMIN' ? (
                    <ShieldAlert className="w-4 h-4 text-accent" />
                  ) : (
                    <User className="w-4 h-4 text-blue-400" />
                  )}
                  {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Shop Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-danger/10 text-muted hover:text-danger rounded-lg border border-transparent hover:border-danger/15 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-surface-ink border border-border text-text-primary hover:bg-primary/20 hover:border-accent/30 transition-all duration-200"
                >
                  Register Your Shop
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-background hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/10 transition-all duration-200"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button & Theme toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted hover:text-text-primary hover:bg-surface-dark border border-transparent hover:border-border transition-all duration-150"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-muted hover:text-text-primary hover:bg-surface-dark border border-transparent hover:border-border transition-all duration-150"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => {
                setMobileOpen(false);
                if (link.path.startsWith('/#') && location.pathname === '/') {
                  e.preventDefault();
                  const id = link.path.split('#')[1];
                  const element = document.getElementById(id);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-muted hover:text-text-primary hover:bg-surface-ink'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <hr className="border-border my-2" />
          
          <div className="py-1">
            <a href="https://maps.app.goo.gl/mK4Tu4jduiumxGB7A?g_st=aw" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface-ink rounded-lg transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Find us on Google
            </a>
          </div>

          <hr className="border-border my-2" />
          {user ? (
            <div className="space-y-2">
              <Link
                to={user.role === 'SUPER_ADMIN' ? '/superadmin/dashboard' : '/admin/dashboard'}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary border border-border font-semibold text-sm text-white"
              >
                Dashboard Panel
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-danger/10 border border-danger/20 font-semibold text-sm text-danger"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block text-center w-full px-4 py-2.5 rounded-lg bg-surface-ink border border-border font-semibold text-sm text-text-primary"
              >
                Register Your Shop
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center w-full px-4 py-2.5 rounded-lg bg-accent text-background font-semibold text-sm"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
