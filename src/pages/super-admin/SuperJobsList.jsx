import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  SlidersHorizontal, 
  Building,
  TrendingUp,
  Layers
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const SuperJobsList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopAnalytics, setShopAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Filters
  const [shopFilter, setShopFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const shopsData = await api.getSuperShops(0, 100);
      setShops(shopsData.content || shopsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        let data;
        if (shopFilter === 'ALL') {
          data = await api.getPlatformAnalytics(fromDate, toDate);
        } else {
          data = await api.getSuperShopAnalytics(shopFilter, fromDate, toDate);
        }
        setShopAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [shopFilter, fromDate, toDate]);

  // Live summary metrics derived from server-side analytics
  const filteredTotalJobs = shopAnalytics ? (shopAnalytics.totalJobs || 0) : 0;
  const filteredTotalRevenue = shopAnalytics ? (shopAnalytics.totalRevenew || shopAnalytics.totalRevenue || 0) : 0;
  const filteredTotalPages = shopAnalytics ? (shopAnalytics.totalPages || 0) : 0;
  const filteredCompletedJobs = shopAnalytics ? (shopAnalytics.completedJobs || 0) : 0;
  const selectedShopName = shopFilter === 'ALL' ? 'All Shops' : (shops.find(s => s.id === shopFilter)?.name || 'Unknown');

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar isSuper={true} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col text-left">
        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <h1 className="text-lg font-serif font-extrabold text-white">Platform Print Jobs Auditor</h1>
          <span className="text-xs text-muted font-bold font-mono">Platform Queue: {filteredTotalJobs}</span>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Platform Filters Grid */}
          <div className="bg-surface-ink border border-border p-5 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 gap-4 items-center">
              
              {/* Shop Destination Dropdown filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold uppercase flex-shrink-0">Shop:</span>
                <select
                  value={shopFilter}
                  onChange={(e) => {
                    setShopFilter(e.target.value);
                  }}
                  className="text-xs w-full max-w-sm"
                >
                  <option value="ALL">All Shops</option>
                  {shops.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Date Picker filters row */}
            <div className="flex flex-col sm:flex-row gap-4 border-t border-border/45 pt-3 items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-muted flex-shrink-0" />
                <span className="text-xs text-muted font-semibold uppercase">Date filters:</span>
              </div>
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">From</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                    }}
                    className="text-xs bg-background border border-border rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">To</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                    }}
                    className="text-xs bg-background border border-border rounded-xl"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Live Summary Bar — updates reactively on shop/filter change */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up">
            
            {/* Summary: Total Jobs */}
            <div className="bg-surface-ink border border-border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md hover:border-accent/30 transition-all">
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted font-bold uppercase tracking-widest block">Jobs Matched</span>
                <span className="text-2xl font-black text-white font-mono block">{filteredTotalJobs}</span>
                <span className="text-[9px] text-muted block">{selectedShopName}</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-border rounded-xl text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            {/* Summary: Total Revenue */}
            <div className="bg-surface-ink border border-border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md hover:border-success/30 transition-all">
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted font-bold uppercase tracking-widest block">Total Revenue</span>
                <span className="text-2xl font-black text-success font-mono block">₹{filteredTotalRevenue.toFixed(0)}</span>
                <span className="text-[9px] text-muted block">est. from all jobs</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-success/20 rounded-xl text-success">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Summary: Completed Jobs */}
            <div className="bg-surface-ink border border-border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md hover:border-accent/30 transition-all">
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted font-bold uppercase tracking-widest block">Completed</span>
                <span className="text-2xl font-black text-accent font-mono block">{filteredCompletedJobs}</span>
                <span className="text-[9px] text-muted block">of {filteredTotalJobs} jobs</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-accent/20 rounded-xl">
                <span className="text-accent text-xs font-black">
                  {filteredTotalJobs > 0 ? Math.round((filteredCompletedJobs / filteredTotalJobs) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Summary: Total Pages */}
            <div className="bg-surface-ink border border-border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md hover:border-blue-400/30 transition-all">
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted font-bold uppercase tracking-widest block">Total Pages</span>
                <span className="text-2xl font-black text-blue-400 font-mono block">{filteredTotalPages}</span>
                <span className="text-[9px] text-muted block">pages spooled</span>
              </div>
              <div className="p-2.5 bg-surface-dark border border-blue-500/20 rounded-xl text-blue-400">
                <Building className="w-5 h-5" />
              </div>
            </div>

          </div>



        </main>
      </div>
    </div>
  );
};

export default SuperJobsList;
