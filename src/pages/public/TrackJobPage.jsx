import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { 
  Search, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  FileCheck, 
  FileText, 
  Printer, 
  AlertTriangle, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';

const TrackJobPage = () => {
  const { token } = useParams();
  const { jobs, shops } = useDb();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Find print job
  const job = jobs.find(j => j.accessToken?.toUpperCase() === token?.toUpperCase());
  const shop = job ? shops.find(s => s.id === job.shopId) : null;

  // Initialize search input
  useEffect(() => {
    if (token) setSearchInput(token);
  }, [token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim().toUpperCase()}`);
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 800);
  };

  // Status Banner Configurations
  const getBannerConfig = (status) => {
    const banners = {
      PENDING: {
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        label: 'Waiting for review',
        sub: 'The shop owner will review your files shortly to calculate the page count and cost.'
      },
      PROCESSING: {
        bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        label: 'Your job is being printed',
        sub: 'Your files are currently in the printer buffer and are actively printing.'
      },
      COMPLETED: {
        bg: 'bg-success/10 border-success/20 text-success',
        label: 'Ready for collection!',
        sub: 'Your job is complete! Please visit the counter and present your token to collect.'
      },
      CANCELLED: {
        bg: 'bg-danger/10 border-danger/20 text-danger',
        label: 'This job was cancelled',
        sub: 'This job was cancelled by the shop admin or customer. No prints were made.'
      }
    };
    return banners[status?.toUpperCase()] || {
      bg: 'bg-muted/10 border-border text-muted',
      label: 'Unknown Status',
      sub: 'Please contact support or refresh to check updates.'
    };
  };

  // Stepper calculations
  const getStepStatus = (status, stepIndex) => {
    const statusIndices = {
      PENDING: 1,
      PROCESSING: 2,
      COMPLETED: 3,
      CANCELLED: -1
    };

    const currentIdx = statusIndices[status?.toUpperCase()] || 0;

    if (currentIdx === -1) {
      return 'cancelled';
    }

    if (stepIndex < currentIdx) return 'completed';
    if (stepIndex === currentIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-xl mx-auto px-4 py-8 space-y-6 text-left">
          {/* Token search header bar */}
          <div className="bg-surface-ink border border-border p-4 rounded-2xl">
            <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search and track token (e.g. B3K9X2)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 text-xs bg-background border border-border focus:border-accent rounded-xl"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-background text-xs font-bold rounded-xl transition-colors"
              >
                Track
              </button>
            </form>
          </div>

          {!token ? (
            /* No search input view */
            <div className="bg-surface-ink border border-border p-8 rounded-3xl text-center space-y-4 animate-scale-in">
              <div className="p-3 bg-surface-dark border border-border rounded-full w-fit mx-auto text-accent">
                <Printer className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white">Track Your Print Job</h2>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Enter the unique 6-character alphanumeric code printed on your success receipt to see live operational progress.
              </p>
            </div>
          ) : !job ? (
            /* Invalid token search */
            <div className="bg-surface-ink border border-border p-8 rounded-3xl text-center space-y-4 animate-scale-in">
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-full w-fit mx-auto text-danger">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white">Token Not Found</h2>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Token "{token}" was not found in our live database. Make sure there are no typos, or try registering a new print job.
              </p>
              <Link 
                to="/shops"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-dark border border-border rounded-xl text-xs font-semibold text-white hover:bg-primary/20 transition-all mx-auto"
              >
                Find a Shop
              </Link>
            </div>
          ) : (
            /* Stateful Job Tracker Display Grid */
            <div className="space-y-6 animate-fade-in">
              
              {/* Receipt Header Card */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted font-bold tracking-wider uppercase">JOB TOKEN RECEIPT</span>
                    <h1 className="font-mono text-3xl text-white font-extrabold text-glow-amber">
                      #{job.accessToken}
                    </h1>
                  </div>
                  <button
                    onClick={triggerRefresh}
                    className="p-2.5 bg-surface-dark hover:bg-surface-dark/75 border border-border rounded-xl text-muted hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Shop specs details */}
                <div className="space-y-2 text-xs text-muted">
                  <h3 className="font-serif text-sm font-bold text-white">{shop?.name || job.shopName}</h3>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{shop?.address || 'Partner Shop Location'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted" />
                    <span>Submitted: {new Date(job.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 border rounded-2xl space-y-1.5 ${getBannerConfig(job.status).bg}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider">{getBannerConfig(job.status).label}</h4>
                <p className="text-[11px] opacity-90 leading-relaxed">{getBannerConfig(job.status).sub}</p>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-6">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3">Operational Progress</h3>
                
                <div className="relative pl-6 border-l-2 border-border space-y-6">
                  {/* Step 1: Submitted */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-success text-background border-2 border-background">
                      <Check className="w-3 h-3" />
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">Job Submitted</h4>
                      <p className="text-[10px] text-muted">Document transmitted successfully into print server.</p>
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className="relative">
                    {getStepStatus(job.status, 1) === 'completed' ? (
                      <span className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-success text-background border-2 border-background">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : getStepStatus(job.status, 1) === 'active' ? (
                      <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-amber-500 border-4 border-background animate-pulse-subtle"></span>
                    ) : getStepStatus(job.status, 1) === 'cancelled' ? (
                      <span className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-danger text-white border-2 border-background">
                        <AlertTriangle className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-border border-4 border-background"></span>
                    )}
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${getStepStatus(job.status, 1) === 'active' ? 'text-amber-500' : 'text-white'}`}>
                        Under Review
                      </h4>
                      <p className="text-[10px] text-muted">Shop staff verifying pages, duplex orientations, and layout bounds.</p>
                    </div>
                  </div>

                  {/* Step 3: Printing */}
                  <div className="relative">
                    {getStepStatus(job.status, 2) === 'completed' ? (
                      <span className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-success text-background border-2 border-background">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : getStepStatus(job.status, 2) === 'active' ? (
                      <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-blue-500 border-4 border-background animate-spin border-t-transparent"></span>
                    ) : getStepStatus(job.status, 2) === 'cancelled' ? (
                      <span className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-danger text-white border-2 border-background">
                        <AlertTriangle className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-border border-4 border-background"></span>
                    )}
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${getStepStatus(job.status, 2) === 'active' ? 'text-blue-400' : 'text-white'}`}>
                        Printing
                      </h4>
                      <p className="text-[10px] text-muted">Ink deposition and paper feed processes actively printing pages.</p>
                    </div>
                  </div>

                  {/* Step 4: Ready to Collect */}
                  <div className="relative">
                    {getStepStatus(job.status, 3) === 'completed' || job.status === 'COMPLETED' ? (
                      <span className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-success text-background border-2 border-background">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : getStepStatus(job.status, 3) === 'cancelled' ? (
                      <span className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-danger text-white border-2 border-background">
                        <AlertTriangle className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-border border-4 border-background"></span>
                    )}
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${job.status === 'COMPLETED' ? 'text-success' : 'text-white'}`}>
                        Ready to Collect
                      </h4>
                      <p className="text-[10px] text-muted">Prints are complete and organized at counter. Awaiting collection.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job configuration details */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-accent" />
                  Print Details
                </h3>

                <div className="space-y-3.5 text-xs">
                  {/* Total files */}
                  <div className="flex justify-between py-1.5 border-b border-border/20">
                    <span className="text-muted">Files Transmitted:</span>
                    <span className="text-white font-bold">{job.files?.length} Files</span>
                  </div>
                  
                  {/* File Names listing */}
                  <div className="py-1">
                    <span className="text-[10px] text-muted font-bold uppercase block mb-1">Filenames:</span>
                    <div className="space-y-1">
                      {job.files?.map(f => (
                        <div key={f.id} className="flex items-center gap-1.5 text-[10px] text-white bg-surface-dark px-2 py-1 rounded border border-border/60">
                          <FileText className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          <span className="truncate">{f.originalName}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Print settings summary */}
                  <div className="flex justify-between py-1.5 border-b border-border/20">
                    <span className="text-muted">Color Print:</span>
                    <span className="text-white font-semibold">{job.printOptions.colorPrint ? 'Full Color' : 'Grayscale (B&W)'}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-border/20">
                    <span className="text-muted">Orientation & Duplex:</span>
                    <span className="text-white font-semibold">{job.printOptions.doubleSided ? 'Double-Sided (Duplex)' : 'Single-Sided'}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-border/20">
                    <span className="text-muted">Paper Size & Copies:</span>
                    <span className="text-white font-semibold">{job.printOptions.paperSize} • {job.printOptions.copies} Copies</span>
                  </div>

                  {/* Estimated Cost */}
                  <div className="flex justify-between py-2 border-y border-border/40 bg-surface-dark/40 px-3.5 rounded-xl items-center mt-2">
                    <span className="text-muted font-semibold text-xs">Est. Job Cost:</span>
                    <span className="font-mono text-sm text-accent font-extrabold">
                      {job.estimatedCost !== null && job.estimatedCost !== undefined 
                        ? `₹${job.estimatedCost.toFixed(2)}` 
                        : 'Calculating (Waiting Review)...'}
                    </span>
                  </div>

                  {/* Special instructions blockquote */}
                  {job.printOptions.specialInstructions && (
                    <div className="bg-surface-dark/40 p-3.5 border-l-2 border-accent rounded-r-xl space-y-1 mt-2 text-left">
                      <span className="text-[9px] text-accent font-bold uppercase tracking-wider block">Customer Note:</span>
                      <p className="text-[11px] text-muted italic font-medium">"{job.printOptions.specialInstructions}"</p>
                    </div>
                  )}

                  {/* Admin notes blockquote */}
                  {job.adminNotes && (
                    <div className="bg-surface-dark/40 p-3.5 border-l-2 border-blue-400 rounded-r-xl space-y-1 mt-2 text-left">
                      <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block">Shop Update:</span>
                      <p className="text-[11px] text-muted italic font-medium">"{job.adminNotes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Live counter info footer label */}
              <div className="text-center">
                <span className="text-[10px] text-muted">
                  Last updated: {lastUpdated.toLocaleTimeString()} • Prints are collected strictly at the partner shop counter.
                </span>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 mt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-muted">
        <p>&copy; {new Date().getFullYear()} PrintEase. Live status monitor.</p>
      </footer>
    </div>
  );
};

export default TrackJobPage;
