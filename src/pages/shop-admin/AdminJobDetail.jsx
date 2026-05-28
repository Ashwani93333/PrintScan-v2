import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { 
  ArrowLeft, 
  User, 
  Printer, 
  Settings, 
  FileText, 
  Download, 
  Coins, 
  Trash2, 
  CheckCircle,
  FileCheck2,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const AdminJobDetail = () => {
  const { jobId } = useParams();
  const { jobs, shops, updateJob } = useDb();
  const navigate = useNavigate();

  // Find job
  const job = jobs.find(j => j.id === jobId);
  const shop = job ? shops.find(s => s.id === job.shopId) : null;

  // Form states
  const [status, setStatus] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Cancellation Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Feedback states
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Load job parameters
  useEffect(() => {
    if (job) {
      setStatus(job.status);
      setTotalPages(job.totalPages || '');
      setEstimatedCost(job.estimatedCost || '');
      setAdminNotes(job.adminNotes || '');
    }
  }, [job]);

  // Dynamically calculate cost based on pages input for extreme realism
  const handlePageCountChange = (e) => {
    const pagesVal = parseInt(e.target.value) || 0;
    setTotalPages(pagesVal);

    if (pagesVal > 0 && shop) {
      const price = job.printOptions.colorPrint 
        ? shop.requirements.pricePerPageColor 
        : shop.requirements.pricePerPageBW;
      const calculated = pagesVal * price * job.printOptions.copies;
      setEstimatedCost(calculated.toFixed(2));
    } else {
      setEstimatedCost('');
    }
  };

  const handleUpdateStatusSubmit = (e) => {
    e.preventDefault();
    if (!job) return;

    updateJob(job.id, {
      status,
      totalPages: totalPages ? parseInt(totalPages) : null,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
      adminNotes
    });

    setToastType('success');
    setToastMessage('Job status updated successfully!');
  };

  const handleCostOverrideSubmit = (e) => {
    e.preventDefault();
    if (!job) return;

    updateJob(job.id, {
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
      adminNotes
    });

    setToastType('success');
    setToastMessage('Estimated cost override applied successfully!');
  };

  const handleDownloadFile = (fileName) => {
    setToastType('info');
    setToastMessage(`Downloading "${fileName}" to local spool directory...`);
  };

  const triggerJobCancellation = () => {
    setConfirmOpen(true);
  };

  const confirmCancellation = () => {
    updateJob(job.id, { status: 'CANCELLED', adminNotes: 'Job cancelled by Shop Administrator.' });
    setConfirmOpen(false);
    setToastType('error');
    setToastMessage('This print job has been cancelled.');
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        <Sidebar isSuper={false} />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white">Job Not Found</h2>
          <Link to="/admin/jobs" className="text-accent underline">Back to Print Queue</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar isSuper={false} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col text-left relative">
        
        {/* Toast feedback notifications */}
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
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/jobs" 
              className="p-1.5 hover:bg-surface-dark border border-transparent hover:border-border rounded-lg text-muted hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg font-serif font-extrabold text-white">Job #{job.accessToken} Detail</h1>
          </div>
          <span className="text-xs text-muted font-mono">{job.id.substring(0, 8)}</span>
        </header>

        {/* Content columns */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8/12 Details Columns */}
            <div className="lg:col-span-8 space-y-6 animate-fade-up">
              
              {/* Header card with badge */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted font-bold tracking-wider block">CURRENT STEP STATUS</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-extrabold text-white">#{job.accessToken}</span>
                    <StatusBadge status={job.status} />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Submitted: {new Date(job.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-2.5 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-accent" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold tracking-wider">Full Name</span>
                    <span className="text-white font-semibold block">{job.customerName}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold tracking-wider">Phone</span>
                    <span className="text-white font-semibold font-mono block">{job.customerPhone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold tracking-wider">Email</span>
                    <span className="text-white font-semibold block truncate">{job.customerEmail || 'Not Provided'}</span>
                  </div>
                </div>
              </div>

              {/* Print preferences summary */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-2.5 flex items-center gap-2">
                  <Printer className="w-4.5 h-4.5 text-accent" />
                  Orientation Options
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Color Mode</span>
                    <span className="text-white font-bold block">{job.printOptions.colorPrint ? 'Full Color' : 'Grayscale (B&W)'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Duplex Layout</span>
                    <span className="text-white font-bold block">{job.printOptions.doubleSided ? 'Double-Sided' : 'Single-Sided'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Paper Size</span>
                    <span className="text-white font-bold block">{job.printOptions.paperSize}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Copies</span>
                    <span className="text-white font-bold block">{job.printOptions.copies} Copies</span>
                  </div>
                </div>

                {job.printOptions.specialInstructions && (
                  <div className="p-4 bg-surface-dark border-l-2 border-accent rounded-r-xl mt-2">
                    <span className="text-[10px] text-accent font-bold uppercase tracking-wider block mb-1">Customer Special Request:</span>
                    <p className="text-xs text-muted italic font-medium leading-relaxed">"{job.printOptions.specialInstructions}"</p>
                  </div>
                )}
              </div>

              {/* Uploaded Documents List */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-serif font-bold text-white border-b border-border/40 pb-2.5 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-accent" />
                  Transmitted Files ({job.files?.length})
                </h3>

                <div className="space-y-2.5">
                  {job.files?.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3.5 bg-surface-dark/60 border border-border/80 rounded-xl hover:border-accent/20 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 text-left">
                          <span className="text-xs font-semibold text-white truncate block max-w-[200px] sm:max-w-[400px]">
                            {file.originalName}
                          </span>
                          <span className="text-[10px] text-muted block">
                            Size: {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB • Format: {file.mimeType}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadFile(file.originalName)}
                        className="px-3 py-1.5 bg-surface-ink hover:bg-surface-dark border border-border rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 hover:text-accent hover:border-accent/40 transition-all duration-150"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 4/12 Management Sidebar */}
            <div className="lg:col-span-4 space-y-6 animate-fade-in stagger-1">
              
              {/* Job Status Controller */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-left space-y-4 shadow-xl">
                <h3 className="text-sm font-serif font-extrabold text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  <Settings className="w-4.5 h-4.5 text-accent" />
                  Job Operations
                </h3>

                <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
                  {/* Select status */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Change Progress Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="PENDING">Pending Review</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="COMPLETED">Ready for Collection</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  {/* Input page count */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Calculate Page Count</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter actual page counts"
                      value={totalPages}
                      onChange={handlePageCountChange}
                    />
                  </div>

                  {/* Auto Calculated Cost preview */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Estimated Cost (Dynamic)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Cost"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        className="pl-7 w-full"
                      />
                    </div>
                    {totalPages > 0 && shop && (
                      <span className="text-[9px] text-accent block mt-0.5 font-semibold">
                        Multiplier: {totalPages} pages x ₹{job.printOptions.colorPrint ? shop.requirements.pricePerPageColor : shop.requirements.pricePerPageBW} rate x {job.printOptions.copies} copies.
                      </span>
                    )}
                  </div>

                  {/* Note textarea */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted font-semibold">Staff Notes (Visible to Customer)</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Bound on glossy 120GSM..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-accent hover:bg-accent-hover text-background text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Save & Update Status
                  </button>
                </form>
              </div>

              {/* Danger zone actions */}
              {(job.status === 'PENDING' || job.status === 'PROCESSING') && (
                <div className="bg-surface-ink border border-danger/35 rounded-3xl p-6 text-left space-y-4 shadow-xl">
                  <h3 className="text-xs font-bold uppercase text-danger border-b border-danger/20 pb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone
                  </h3>
                  <button
                    onClick={triggerJobCancellation}
                    className="w-full py-2.5 bg-danger/10 border border-danger/20 text-danger hover:bg-danger/15 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel This Print Job
                  </button>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Cancellation Dialog */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Cancel Active Job"
        message="Are you sure you want to abort printing and cancel this customer request? A notification notes update will be logged, and printing parameters halted."
        confirmText="Confirm Cancellation"
        cancelText="Abort"
        onConfirm={confirmCancellation}
        onCancel={() => setConfirmOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default AdminJobDetail;
