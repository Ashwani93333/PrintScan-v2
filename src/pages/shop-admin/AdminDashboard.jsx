import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Plus, 
  Store, 
  Sliders, 
  Eye, 
  TrendingUp,
  FileCheck2,
  QrCode,
  Layers,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalPagesPrinted: 0,
    totalRevenue: 0,
    recentJobs: []
  });
  const [loading, setLoading] = useState(true);

  // Shop Context mapping
  const shopId = user?.shopId;

  useEffect(() => {
    const fetchData = async () => {
      if (!shopId) return;
      try {
        const [shopData, dashboardData] = await Promise.all([
          api.getShopProfile(shopId),
          api.getDashboardStats(shopId)
        ]);
        setShop(shopData);
        if (dashboardData) setStats(dashboardData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        <Sidebar isSuper={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  // Stats calculation
  const { totalJobs, totalPagesPrinted, totalRevenue, recentJobs = [] } = stats;
  
  // As the API only returns high-level totals and a few recent jobs,
  // we will derive approximations for the dashboard cards from recentJobs
  const pendingJobs = recentJobs.filter(j => j.status === 'PENDING').length;
  const completedJobs = recentJobs.filter(j => j.status === 'COMPLETED').length;
  const cancelledJobs = recentJobs.filter(j => j.status === 'CANCELLED').length;

  const qrVisits = shop?.qrVisits || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Nav Shell */}
      <Sidebar isSuper={false} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col text-left">
        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-serif font-extrabold text-white">Dashboard Overview</h1>
            <span className="px-2 py-0.5 rounded bg-surface-dark border border-border text-[10px] text-accent font-semibold">
              {shop?.name || 'My Shop'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted font-bold font-mono">Live Sync: Active</span>
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-ping"></div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
            
            {/* Total Jobs */}
            <div className="bg-surface-ink border border-border p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-border/80 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Total Jobs</span>
                <span className="text-2xl font-bold text-white block">{totalJobs}</span>
              </div>
              <div className="p-3 bg-surface-dark border border-border rounded-xl text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            {/* Pending Jobs */}
            <div className="bg-surface-ink border border-border p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-border/80 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block font-serif text-accent">Pending</span>
                <span className="text-2xl font-bold text-accent block">{pendingJobs}</span>
              </div>
              <div className="p-3 bg-surface-dark border border-border rounded-xl text-accent animate-pulse-subtle">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Completed Jobs */}
            <div className="bg-surface-ink border border-border p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-border/80 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Completed</span>
                <span className="text-2xl font-bold text-success block">{completedJobs}</span>
              </div>
              <div className="p-3 bg-surface-dark border border-border rounded-xl text-success">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Cancelled Jobs */}
            <div className="bg-surface-ink border border-border p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-border/80 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Cancelled</span>
                <span className="text-2xl font-bold text-danger block">{cancelledJobs}</span>
              </div>
              <div className="p-3 bg-surface-dark border border-border rounded-xl text-danger">
                <XCircle className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Shop Analytics & Insights Section */}
          <div className="bg-surface-ink border border-border rounded-3xl p-6 shadow-xl space-y-6 animate-fade-up">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="space-y-1">
                <h2 className="text-sm font-serif font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent animate-pulse-subtle" />
                  Shop Analytics & Revenue Insights
                </h2>
                <p className="text-xs text-muted">Real-time metrics to scale your counter and cloud printing revenue.</p>
              </div>
              <span className="text-[10px] bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full text-accent font-mono font-bold uppercase">
                Active Cycle
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Revenue Increment */}
              <div className="bg-surface-dark border border-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted font-bold tracking-widest uppercase">Revenue Stream</span>
                  <span className="p-2 bg-success/10 text-success border border-success/20 rounded-xl">
                    <span className="text-xs font-extrabold">₹</span>
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-border/20 pb-1.5">
                    <span className="text-xs text-muted">Total Earned</span>
                    <span className="font-mono text-base text-success font-black">₹{totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border/20 pb-1.5">
                    <span className="text-xs text-muted">Pending Estimates</span>
                    <span className="font-mono text-sm text-white font-extrabold">—</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border/20 pb-1.5">
                    <span className="text-xs text-muted">Awaiting Collection</span>
                    <span className="font-mono text-sm text-accent font-extrabold">—</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Print Operations */}
              <div className="bg-surface-dark border border-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted font-bold tracking-widest uppercase">Print Volume</span>
                  <span className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                    <Layers className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-border/20 pb-1.5">
                    <span className="text-xs text-muted font-bold">Total Printed</span>
                    <span className="font-mono text-sm text-blue-400 font-extrabold">{totalPagesPrinted} pgs</span>
                  </div>
                  <div className="flex justify-between items-end pt-0.5">
                    <span className="text-xs text-muted font-bold">QR Visits (Traffic)</span>
                    <span className="font-mono text-base text-accent font-black">{qrVisits} visits</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Today's Dispatch Activity */}
              <div className="bg-surface-dark border border-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted font-bold tracking-widest uppercase">Today's Traffic</span>
                  <span className="p-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
                    <Activity className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                    <span className="text-xs text-muted">Recent Activity (Last {recentJobs.length})</span>
                    <span className="font-mono text-sm text-white font-bold">Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                    <div className="p-2 bg-surface-ink/60 border border-border/30 rounded-lg text-left">
                      <span className="text-muted block uppercase tracking-wide text-[8px]">Pending</span>
                      <span className="font-mono text-xs text-accent font-bold">{pendingJobs}</span>
                    </div>
                    <div className="p-2 bg-surface-ink/60 border border-border/30 rounded-lg text-left">
                      <span className="text-muted block uppercase tracking-wide text-[8px]">Completed</span>
                      <span className="font-mono text-xs text-success font-bold">{completedJobs}</span>
                    </div>
                    <div className="p-2 bg-surface-ink/60 border border-border/30 rounded-lg text-left">
                      <span className="text-muted block uppercase tracking-wide text-[8px]">Cancelled</span>
                      <span className="font-mono text-xs text-danger font-bold">{cancelledJobs}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Table & Quick Actions grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8/12 Recent Jobs Queue */}
            <div className="lg:col-span-8 bg-surface-ink border border-border rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in stagger-1">
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <h3 className="text-sm font-serif font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Recent Document Uploads
                </h3>
                <Link 
                  to="/admin/jobs" 
                  className="text-xs text-accent hover:underline font-bold inline-flex items-center gap-0.5"
                >
                  View All Jobs
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentJobs.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted space-y-2">
                  <p>No print jobs registered yet.</p>
                  <button 
                    onClick={() => navigate(`/shops/${shop?.slug || 'campus-quick-print'}`)}
                    className="text-accent underline font-semibold"
                  >
                    Simulate customer file upload
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/60 text-muted uppercase font-bold text-[10px] tracking-wider">
                        <th className="py-3 px-3">Token</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Pages</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Submitted At</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {recentJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-surface-dark/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-accent">{job.accessToken}</td>
                          <td className="py-3 px-3 text-white font-medium">{job.customerName}</td>
                          <td className="py-3 px-3">
                            <StatusBadge status={job.status} />
                          </td>
                          <td className="py-3 px-3 text-muted">
                            {job.totalPages !== null && job.totalPages !== undefined ? `${job.totalPages} pgs` : '—'}
                          </td>
                          <td className="py-3 px-3 font-mono text-white font-semibold">
                            {job.estimatedCost !== null && job.estimatedCost !== undefined 
                              ? `₹${job.estimatedCost.toFixed(2)}` 
                              : '—'}
                          </td>
                          <td className="py-3 px-3 text-muted">{new Date(job.createdAt).toLocaleTimeString()}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => navigate(`/admin/jobs/${job.id}`)}
                              className="p-1.5 bg-surface-dark hover:bg-surface-dark/70 border border-border hover:border-accent/40 text-muted hover:text-white rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right 4/12 Quick Action Cards */}
            <div className="lg:col-span-4 space-y-6 animate-fade-in stagger-2">
              
              {/* Quick Actions Panel */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-left space-y-4 shadow-xl">
                <h3 className="text-sm font-serif font-extrabold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-accent" />
                  Quick Controls
                </h3>

                <div className="space-y-2.5">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 p-3 bg-surface-dark/60 border border-border hover:border-accent/40 rounded-xl transition-all w-full text-xs font-semibold text-white group"
                  >
                    <div className="p-2 bg-surface-ink border border-border text-accent rounded-lg group-hover:bg-accent/15 transition-all">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold">Configure Profile</span>
                      <span className="block text-[10px] text-muted font-normal mt-0.5">Rates, files, active status</span>
                    </div>
                  </Link>

                  <Link
                    to="/admin/jobs"
                    className="flex items-center gap-3 p-3 bg-surface-dark/60 border border-border hover:border-accent/40 rounded-xl transition-all w-full text-xs font-semibold text-white group"
                  >
                    <div className="p-2 bg-surface-ink border border-border text-accent rounded-lg group-hover:bg-accent/15 transition-all">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold">Pending Review Queue</span>
                      <span className="block text-[10px] text-muted font-normal mt-0.5">Approve or recalculate costs</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Dynamic shop details stats */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-left space-y-4 shadow-xl">
                <h3 className="text-xs font-serif font-extrabold text-white tracking-widest uppercase block border-b border-border/40 pb-3">Active Pricing Parameters</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted">B&W Rate:</span>
                    <span className="font-mono text-white font-bold">₹{shop?.requirements.pricePerPageBW.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted">Color Rate:</span>
                    <span className="font-mono text-accent font-bold">₹{shop?.requirements.pricePerPageColor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted">Status:</span>
                    <span className="px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded font-bold text-[9px]">OPEN</span>
                  </div>
                </div>
              </div>

              {/* Quick QR Code Card */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-center space-y-4 shadow-xl">
                <h3 className="text-sm font-serif font-extrabold text-white border-b border-border/40 pb-3 flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4 text-accent" />
                  Shop Counter QR
                </h3>
                <div className="flex justify-center p-2 bg-surface-dark border border-border rounded-2xl w-fit mx-auto">
                  {shop ? (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        `${window.location.origin}/shops/${shop.slug}`
                      )}`}
                      alt="QR Code" 
                      className="w-28 h-28 rounded bg-white p-1"
                    />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center text-xs text-muted">No QR Available</div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-muted">Place QR at your shop counter. Customers scan to upload files instantly.</p>
                  <Link 
                    to="/admin/profile" 
                    className="text-xs text-accent hover:underline font-bold block"
                  >
                    Manage & Download QR →
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
