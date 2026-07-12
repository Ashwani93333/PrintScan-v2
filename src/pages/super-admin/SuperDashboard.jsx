import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Store, 
  Check, 
  X, 
  FileText, 
  Layers, 
  AlertCircle, 
  TrendingUp, 
  Eye, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import ShopDetailModal from '../../components/ShopDetailModal';

const SuperDashboard = () => {
  const navigate = useNavigate();

  // Dialog & Feedback states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalAction, setModalAction] = useState({ type: '', id: '', name: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailShopId, setDetailShopId] = useState(null);

  const [shops, setShops] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const fetchData = async () => {
    try {
      const [shopsData, analyticsData] = await Promise.all([
        api.getSuperShops(0, 100),
        api.getPlatformAnalytics().catch(() => ({}))
      ]);
      setShops(shopsData.content || shopsData || []);
      setAnalytics(analyticsData || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Platform metrics calculation
  const totalShops = analytics?.totalShops || shops.length;
  const activeShops = analytics?.activeShops || shops.filter(s => s.isApproved).length;
  const pendingApprovals = shops.filter(s => !s.isApproved);
  const pendingShopsCount = pendingApprovals.length;
  
  const totalJobs = analytics?.totalJobs || 0;
  // const jobsThisMonth = analytics?.jobsThisMonth || 0;

  // Filter pending approvals list
  const pendingList = pendingApprovals
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Platform jobs mini queue (last 6)
  const recentPlatformJobs = analytics?.recentJobs || [];

  const handleApproveClick = (shopId, shopName) => {
    setModalAction({ type: 'APPROVE', id: shopId, name: shopName });
    setConfirmOpen(true);
  };

  const handleRejectClick = (shopId, shopName) => {
    setModalAction({ type: 'REJECT', id: shopId, name: shopName });
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    setConfirmOpen(false);
    try {
      if (modalAction.type === 'APPROVE') {
        await api.approveShop(modalAction.id);
        setToastType('success');
        setToastMessage(`Shop "${modalAction.name}" approved successfully!`);
      } else if (modalAction.type === 'REJECT') {
        await api.rejectShop(modalAction.id);
        setToastType('error');
        setToastMessage(`Shop "${modalAction.name}" registration rejected.`);
      }
      fetchData(); // refresh
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Action failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Nav Shell */}
      <Sidebar isSuper={true} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col text-left relative">
        
        {/* Toast Feedback notifications */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 animate-scale-in">
            <Toast 
              message={toastMessage} 
              type={toastType} 
              onClose={() => setToastMessage('')} 
            />
          </div>
        )}

        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-serif font-extrabold text-text-primary">Super Admin Dashboard</h1>
            <span className="px-2 py-0.5 rounded bg-surface-dark border border-border text-[9px] text-accent font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" />
              Platform Controller
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted font-semibold">
            <span>Server Status: Operational</span>
            <div className="w-2 h-2 rounded-full bg-success"></div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Stats Row (5 Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-up">
            
            {/* Total Shops */}
            <div className="bg-surface-ink border border-border p-4.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase block">Total Shops</span>
                <span className="text-xl font-bold text-text-primary block">{totalShops}</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-border rounded-xl text-blue-400">
                <Store className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Active Shops */}
            <div className="bg-surface-ink border border-border p-4.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase block">Active Shops</span>
                <span className="text-xl font-bold text-success block">{activeShops}</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-border rounded-xl text-success">
                <Layers className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-surface-ink border border-border p-4.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase block font-serif text-accent">Pending Appr.</span>
                <span className="text-xl font-bold text-accent block">{pendingShopsCount}</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-border rounded-xl text-accent animate-pulse-subtle">
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Total Jobs */}
            <div className="bg-surface-ink border border-border p-4.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase block">Total Jobs</span>
                <span className="text-xl font-bold text-text-primary block">{totalJobs}</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-border rounded-xl text-blue-400">
                <FileText className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Jobs This Month */}
            {/* <div className="bg-surface-ink border border-border p-4.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase block">Jobs This Month</span>
                <span className="text-xl font-bold text-text-primary block">{jobsThisMonth}</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-border rounded-xl text-accent">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
            </div> */}

          </div>

          {/* Pending Approvals Highlights Box */}
          <div className="bg-surface-ink border border-border rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in stagger-1">
            <h3 className="text-sm font-serif font-extrabold text-text-primary border-b border-border/40 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-accent" />
              Shops Awaiting Approval ({pendingShopsCount})
            </h3>

            {pendingList.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted">
                No shops currently awaiting platform approval. All clear!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingList.map(shop => (
                  <div key={shop.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-surface-dark/60 border border-border rounded-2xl hover:border-accent/20 transition-all">
                    <div 
                      className="space-y-1 cursor-pointer group flex-1"
                      onClick={() => {
                        setDetailShopId(shop.id);
                        setDetailModalOpen(true);
                      }}
                    >
                      <h4 className="text-xs font-serif font-bold text-text-primary group-hover:text-accent transition-colors flex items-center gap-1.5">
                        {shop.name}
                        <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-[10px] text-muted">
                        Owner: <span className="text-text-primary font-medium">{shop.adminName}</span> ({shop.adminEmail}) • Slug: <span className="font-mono text-accent">/shops/{shop.slug}</span>
                      </p>
                      <span className="text-[9px] text-muted block">Applied: {new Date(shop.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleRejectClick(shop.id, shop.name)}
                        className="flex-1 sm:flex-none px-3.5 py-1.5 bg-danger/10 border border-danger/25 text-danger rounded-xl text-[10px] font-bold hover:bg-danger/15 transition-all flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveClick(shop.id, shop.name)}
                        className="flex-1 sm:flex-none px-3.5 py-1.5 bg-success/15 border border-success/25 text-success rounded-xl text-[10px] font-bold hover:bg-success/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Shop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform recent jobs list
          <div className="bg-surface-ink border border-border rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in stagger-2">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="text-sm font-serif font-extrabold text-text-primary flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-accent" />
                Recent Platform Print Requests
              </h3>
              <Link 
                to="/superadmin/jobs" 
                className="text-xs text-accent hover:underline font-bold inline-flex items-center gap-0.5"
              >
                Auditor View
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3">Token</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Shop Destination</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Pages</th>
                    <th className="py-3 px-3">Est. Cost</th>
                    <th className="py-3 px-3">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentPlatformJobs.map(job => (
                    <tr key={job.id} className="hover:bg-surface-dark/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-accent">{job.accessToken}</td>
                      <td className="py-3.5 px-3 text-text-primary font-medium">{job.customerName}</td>
                      <td className="py-3.5 px-3 text-text-primary">{job.shopName}</td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="py-3.5 px-3 text-muted">{job.totalPages || '—'} pages</td>
                      <td className="py-3.5 px-3 font-mono text-text-primary font-semibold">
                        {job.estimatedCost !== null && job.estimatedCost !== undefined 
                          ? `₹${job.estimatedCost.toFixed(2)}` 
                          : 'Calculating...'}
                      </td>
                      <td className="py-3.5 px-3 text-muted">
                        {new Date(job.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}

        </main>
      </div>

      {/* Confirmation approval modal dialog */}
      <ConfirmModal
        isOpen={confirmOpen}
        title={modalAction.type === 'APPROVE' ? 'Approve Platform Shop' : 'Reject Shop Application'}
        message={
          modalAction.type === 'APPROVE' 
            ? `Are you sure you want to approve "${modalAction.name}"? This shop will instantly receive active open parameters, display in the public directory search index, and the owner will be enabled to process print requests.` 
            : `Are you sure you want to reject the application for "${modalAction.name}"? This shop registration details will be permanently purged from the system.`
        }
        confirmText={modalAction.type === 'APPROVE' ? 'Confirm Approval' : 'Reject Application'}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
        isDanger={modalAction.type === 'REJECT'}
      />

      <ShopDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        shopId={detailShopId}
      />
    </div>
  );
};

export default SuperDashboard;
