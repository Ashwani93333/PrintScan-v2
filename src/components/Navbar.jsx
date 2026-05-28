import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Printer, User, LogOut, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
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
    { name: 'Find a Shop', path: '/shops' },
    { name: 'Track My Print', path: '/track/1' }, // Mocking tracking link placeholder
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Icon */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg group-hover:bg-accent/20 transition-all duration-200">
                <Printer className="w-5 h-5 text-accent animate-pulse-subtle" />
              </div>
              <span className="text-xl font-serif font-extrabold text-white tracking-tight">
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
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-accent border-b border-accent pb-1' 
                    : 'text-muted hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Panel (Auth & Actions) */}
          <div className="hidden md:flex items-center gap-4">
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
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-surface-ink border border-border text-white hover:bg-primary/20 hover:border-accent/30 transition-all duration-200"
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

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface-dark border border-transparent hover:border-border transition-all duration-150"
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
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-muted hover:text-white hover:bg-surface-ink'
              }`}
            >
              {link.name}
            </Link>
          ))}
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
                className="block text-center w-full px-4 py-2.5 rounded-lg bg-surface-ink border border-border font-semibold text-sm text-white"
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
