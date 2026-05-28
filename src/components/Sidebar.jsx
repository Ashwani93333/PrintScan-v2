import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { 
  LayoutDashboard, 
  FileText, 
  Store, 
  Settings, 
  LogOut, 
  BarChart3, 
  Users, 
  ShieldAlert, 
  Menu,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react';

const Sidebar = ({ isSuper = false }) => {
  const { user, logout } = useAuth();
  const { jobs, shops } = useDb();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Calculate pending jobs count for badge
  const pendingCount = jobs.filter(j => 
    isSuper ? j.status === 'PENDING' : (j.status === 'PENDING' && j.shopId === user?.shopId)
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Print Jobs', path: '/admin/jobs', icon: <FileText className="w-5 h-5" />, badge: pendingCount },
    { name: 'Shop Profile', path: '/admin/profile', icon: <Store className="w-5 h-5" /> },
    { name: 'Change Password', path: '/admin/settings/password', icon: <Settings className="w-5 h-5" /> },
  ];

  const superMenu = [
    { name: 'Dashboard', path: '/superadmin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Shops Directory', path: '/superadmin/shops', icon: <Store className="w-5 h-5" />, badge: shops.filter(s => !s.isApproved).length },
    { name: 'All Print Jobs', path: '/superadmin/jobs', icon: <FileText className="w-5 h-5" /> },
    { name: 'Platform Analytics', path: '/superadmin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const currentMenu = isSuper ? superMenu : adminMenu;

  return (
    <>
      {/* Mobile Top Header (when sidebar is hidden on small viewports) */}
      <div className="flex md:hidden items-center justify-between px-4 h-14 bg-surface-dark border-b border-border w-full sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-accent" />
          <span className="font-serif font-extrabold text-sm text-white">
            {isSuper ? 'PrintEase Super' : 'PrintEase Admin'}
          </span>
        </div>
        <button
          onClick={() => setMobileVisible(!mobileVisible)}
          className="p-2 border border-border rounded-lg text-muted hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileVisible && (
        <div 
          onClick={() => setMobileVisible(false)} 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {/* Sidebar Shell */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-surface-ink border-r border-border flex flex-col justify-between py-6 transition-all duration-300 ${
          mobileVisible ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Toggle Collapse Button for Desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute top-7 -right-3 p-1 rounded-full bg-border text-muted hover:text-white border border-border transition-all duration-150"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Brand/User Header */}
        <div className="px-4 mb-8">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="p-2.5 bg-accent/15 rounded-lg border border-accent/25 flex-shrink-0 text-accent">
              {isSuper ? <ShieldAlert className="w-5 h-5" /> : <Store className="w-5 h-5" />}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h3 className="font-serif font-extrabold text-sm text-white truncate">
                  {isSuper ? 'Super Admin' : user?.name || 'Shop Admin'}
                </h3>
                <p className="text-[10px] text-muted truncate">
                  {isSuper ? 'Platform controller' : user?.email || 'admin@printease.com'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {currentMenu.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileVisible(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                  active 
                    ? 'bg-accent/10 border-l-2 border-accent text-accent font-semibold' 
                    : 'text-muted hover:text-white hover:bg-surface-dark border-l-2 border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : ''}
              >
                <span className={`transition-transform duration-200 group-hover:scale-105 ${active ? 'text-accent' : 'text-muted group-hover:text-white'}`}>
                  {item.icon}
                </span>
                
                {!collapsed && (
                  <span className="text-sm truncate flex-1">{item.name}</span>
                )}

                {/* Badge Overlay */}
                {item.badge > 0 && (
                  <span className={`flex-shrink-0 inline-flex items-center justify-center font-mono text-[10px] font-bold rounded-full w-5 h-5 ${
                    active ? 'bg-accent text-background' : 'bg-accent/15 text-accent border border-accent/20'
                  } ${collapsed ? 'absolute top-1.5 right-1.5' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 border-t border-border/60 pt-4 mt-auto">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl hover:bg-danger/10 text-muted hover:text-danger hover:border-danger/15 transition-all duration-200 ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
