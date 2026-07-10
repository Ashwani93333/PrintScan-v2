import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Calendar, 
  Store, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  SlidersHorizontal,
  TrendingUp,
  Layers,
  Users
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const SuperAnalytics = () => {
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({
    totalShops: 0,
    approvedShops: 0,
    totalJobs: 0,
    completedJobs: 0,
    cancelledJobs: 0,
    jobsByDate: [],
    shopCompletionRates: []
  });

  // Date filters states
  const [from, setFrom] = useState('2026-05-01');
  const [to, setTo] = useState('2026-05-31');
  const [activeFrom, setActiveFrom] = useState('2026-05-01');
  const [activeTo, setActiveTo] = useState('2026-05-31');

  const fetchData = async () => {
    try {
      const [shopsData, analyticsData] = await Promise.all([
        api.getSuperShops(0, 100),
        api.getPlatformAnalytics(activeFrom, activeTo).catch(() => null)
      ]);
      setShops(shopsData.content || shopsData || []);
      if (analyticsData) {
        setStats(prev => ({ ...prev, ...analyticsData }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFrom, activeTo]);

  // Sum total QR visitors across all shops
  const totalQrVisitors = shops.reduce((sum, s) => sum + (s.qrVisits || 0), 0);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setActiveFrom(from);
    setActiveTo(to);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar isSuper={true} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col text-left">
        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <h1 className="text-lg font-serif font-extrabold text-text-primary">Platform Performance Analytics</h1>
          <span className="text-xs text-muted font-bold font-mono">Period: {activeFrom} to {activeTo}</span>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Date Range Selector Bar */}
          <div className="bg-surface-ink border border-border p-5 rounded-2xl">
            <form onSubmit={handleApplyFilters} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto text-xs text-muted">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="font-semibold uppercase mr-1">Period Selection:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-muted">From</span>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="text-xs bg-background border border-border rounded-xl"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-muted">To</span>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="text-xs bg-background border border-border rounded-xl"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-accent hover:bg-accent-hover text-background text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-up">
            
            {/* Total Shops */}
            <div className="bg-surface-ink border border-border p-4 rounded-xl space-y-1">
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">Total Shops</span>
              <span className="text-xl font-bold text-text-primary block">{stats.totalShops}</span>
              <span className="text-[8px] text-muted flex items-center gap-0.5"><Store className="w-2.5 h-2.5" /> platform vendors</span>
            </div>

            {/* Active Shops */}
            <div className="bg-surface-ink border border-border p-4 rounded-xl space-y-1">
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">Active Shops</span>
              <span className="text-xl font-bold text-success block">{stats.activeShops}</span>
              <span className="text-[8px] text-muted flex items-center gap-0.5"><Layers className="w-2.5 h-2.5 text-success" /> currently open</span>
            </div>

            {/* Total Jobs */}
            <div className="bg-surface-ink border border-border p-4 rounded-xl space-y-1">
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">Total Jobs</span>
              <span className="text-xl font-bold text-text-primary block">{stats.totalJobs}</span>
              <span className="text-[8px] text-muted flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> in period</span>
            </div>

            {/* Completed Jobs */}
            <div className="bg-surface-ink border border-border p-4 rounded-xl space-y-1">
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider block text-success font-serif">Completed</span>
              <span className="text-xl font-bold text-success block">{stats.completedJobs}</span>
              <span className="text-[8px] text-muted flex items-center gap-0.5"><CheckCircle className="w-2.5 h-2.5 text-success" /> collected</span>
            </div>

            {/* Cancelled Jobs */}
            <div className="bg-surface-ink border border-border p-4 rounded-xl space-y-1">
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider block text-danger font-serif">Cancelled</span>
              <span className="text-xl font-bold text-danger block">{stats.cancelledJobs}</span>
              <span className="text-[8px] text-muted flex items-center gap-0.5"><XCircle className="w-2.5 h-2.5 text-danger" /> aborted</span>
            </div>



            {/* Total QR Visitors */}
            <div className="bg-surface-ink border border-accent/20 p-4 rounded-xl space-y-1">
              <span className="text-[9px] text-accent font-bold uppercase tracking-wider block">QR Visitors</span>
              <span className="text-xl font-bold text-accent block">{totalQrVisitors}</span>
              <span className="text-[8px] text-muted flex items-center gap-0.5"><Users className="w-2.5 h-2.5 text-accent" /> total scans</span>
            </div>

          </div>

          {/* Graphics visualizers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8/12 Recharts Vector Graph */}
            <div className="lg:col-span-8 bg-surface-ink border border-border rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in stagger-1 text-left">
              <h3 className="text-sm font-serif font-extrabold text-text-primary border-b border-border/40 pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Continuous Daily Print Job Volume
              </h3>

              {stats.jobsByDate.length === 0 ? (
                <div className="h-64 flex justify-center items-center text-xs text-muted">
                  No print jobs registered within selected period bounds.
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.jobsByDate}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E8A838" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#E8A838" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#2E354F" strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#8A8FA3" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={{ stroke: '#2E354F' }}
                      />
                      <YAxis 
                        stroke="#8A8FA3" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E2435', 
                          borderColor: '#2E354F',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          fontSize: '11px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        name="Jobs Count"
                        stroke="#E8A838" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Right 4/12 Top Shops rankings with completion rate progress bars */}
            <div className="lg:col-span-4 bg-surface-ink border border-border rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in stagger-2 text-left">
              <h3 className="text-sm font-serif font-extrabold text-text-primary border-b border-border/40 pb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-accent" />
                Top Performing Shops
              </h3>

              {stats.shopCompletionRates.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted">
                  No active rankings in selected period.
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.shopCompletionRates.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-text-primary truncate max-w-[150px]">{item.shopName}</span>
                        {item.jobCount !== undefined && <span className="text-muted font-mono">{item.jobCount} jobs</span>}
                      </div>
                      
                      {/* Cost dynamic completion progress bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-surface-dark h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-accent h-full rounded-full transition-all duration-300"
                            style={{ width: `${item.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-muted">
                          <span>Completion Rate:</span>
                          <span className="font-bold text-accent">{item.completionRate?.toFixed(1) || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default SuperAnalytics;
