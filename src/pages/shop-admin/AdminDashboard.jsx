import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDb } from '../../context/DbContext';
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
  QrCode
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { jobs, shops } = useDb();
  const navigate = useNavigate();

  // Shop Context mapping
  const shopId = user?.shopId || "a90b4d45-ff1a-4643-982c-d9c087b322a3"; // Fallback to Campus Quick Print for demo
  const shop = shops.find(s => s.id === shopId);
  const shopJobs = jobs.filter(j => j.shopId === shopId);

  // Stats calculation
  const totalJobs = shopJobs.length;
  const pendingJobs = shopJobs.filter(j => j.status === 'PENDING').length;
  const completedJobs = shopJobs.filter(j => j.status === 'COMPLETED').length;
  const cancelledJobs = shopJobs.filter(j => j.status === 'CANCELLED').length;
  
  // Sort and limit recent jobs (last 5)
  const recentJobs = [...shopJobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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
                    onClick={() => navigate(`/shops/${shop?.slug || 'campus-quick-print'}/upload`)}
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
                        <th className="py-3 px-3">Files</th>
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
                          <td className="py-3 px-3 text-muted">{job.files?.length} files</td>
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
