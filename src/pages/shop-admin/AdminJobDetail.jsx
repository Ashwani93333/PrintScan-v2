import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [status, setStatus] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [staffNote, setStaffNote] = useState('');

  // Cancellation Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Feedback states
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const jobData = await api.getAdminJobDetails(jobId);
      setJob(jobData);
      
      const shopId = jobData.shopId || user?.shopId;
      if (shopId) {
        const shopData = await api.getShopProfile(shopId);
        setShop(shopData);
      }
      
      setStatus(jobData.status);
      setTotalPages(jobData.totalPages || '');
      setEstimatedCost(jobData.estimatedCost || '');
      setStaffNote(jobData.adminNotes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  // Dynamically calculate cost based on pages input for extreme realism
  const handlePageCountChange = (e) => {
    const pagesVal = parseInt(e.target.value) || 0;
    setTotalPages(pagesVal);

    if (pagesVal > 0 && shop && job?.printOptions) {
      const price = job.printOptions.colorPrint 
        ? shop.requirements?.pricePerPageColor || 10
        : shop.requirements?.pricePerPageBW || 2;
      const calculated = pagesVal * price * (job.printOptions.copies || 1);
      setEstimatedCost(calculated.toFixed(2));
    } else {
      setEstimatedCost('');
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    // Basic validation
    if (totalPages && (isNaN(parseInt(totalPages)) || parseInt(totalPages) < 1)) {
      setToastType('error');
      setToastMessage('Total pages must be a positive number.');
      return;
    }

    try {
      await api.updateAdminJob(job.id, {
        status,
        totalPages: totalPages ? parseInt(totalPages) : null,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
      });
      setToastType('success');
      setToastMessage('Job status updated successfully!');
      fetchJobDetails(); // refresh
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to update job');
    }
  };

  const handleCostOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    try {
      await api.updateAdminJob(job.id, {
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
      });
      setToastType('success');
      setToastMessage('Estimated cost override applied successfully!');
      fetchJobDetails(); // refresh
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to override cost');
    }
  };


  const handleDownloadFile = async (fileName, fileUrl) => {
    try {
      setToastType('info');
      setToastMessage(`Downloading "${fileName}"...`);
      
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Failed to fetch file from CDN");
      const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setToastType('success');
      setToastMessage(`Downloaded "${fileName}" successfully!`);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to download file');
    }
  };

  const handlePrintFile = async (fileName, fileUrl) => {
    try {
      setToastType('info');
      setToastMessage(`Preparing "${fileName}" for printing...`);
      
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("File is Deleted or Unavailable for Printing Due to Privacy Policy");
      const blob = await res.blob();
      
      const fileType = fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : blob.type;
      const typedBlob = new Blob([blob], { type: fileType });
      
      const url = window.URL.createObjectURL(typedBlob);
      
      const printWindow = window.open(url, '_blank');
      if (!printWindow) {
        setToastType('error');
        setToastMessage('Please allow popups to open the print view.');
        return;
      }
      
      setToastType('success');
      setToastMessage(`Opened "${fileName}" for printing!`);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000); 
      
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to prepare file for printing');
    }
  };

  const triggerJobCancellation = () => {
    setConfirmOpen(true);
  };

  const confirmCancellation = async () => {
    try {
      await api.updateAdminJob(job.id, { status: 'CANCELLED' });
      setConfirmOpen(false);
      setToastType('warning');
      setToastMessage('This print job has been cancelled.');
      fetchJobDetails(); // refresh
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to cancel job');
    }
  };

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

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        <Sidebar isSuper={false} />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold text-text-primary">Job Not Found</h2>
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
              className="p-1.5 hover:bg-surface-dark border border-transparent hover:border-border rounded-lg text-muted hover:text-text-primary transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg font-serif font-extrabold text-text-primary">Job #{job.accessToken} Detail</h1>
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
                    <span className="font-mono text-2xl font-extrabold text-text-primary">#{job.accessToken}</span>
                    <StatusBadge status={job.status} />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Submitted: {new Date(job.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Info Card */}
              {/* <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-serif font-bold text-text-primary border-b border-border/40 pb-2.5 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-accent" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold tracking-wider">Full Name</span>
                    <span className="text-text-primary font-semibold block">{job.customerName}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold tracking-wider">Phone</span>
                    <span className="text-text-primary font-semibold font-mono block">{job.customerPhone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold tracking-wider">Email</span>
                    <span className="text-text-primary font-semibold block truncate">{job.customerEmail || 'Not Provided'}</span>
                  </div>
                </div>
              </div> */}

              {/* Print preferences summary */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-serif font-bold text-text-primary border-b border-border/40 pb-2.5 flex items-center gap-2">
                  <Printer className="w-4.5 h-4.5 text-accent" />
                  Orientation Options
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Color Mode</span>
                    <span className="text-text-primary font-bold block">{job.colorPrint ? 'Full Color' : 'Grayscale (B&W)'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Duplex Layout</span>
                    <span className="text-text-primary font-bold block">{job.doubleSided ? 'Double-Sided' : 'Single-Sided'}</span>
                  </div>
                  {/* <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Paper Size</span>
                    <span className="text-text-primary font-bold block">{job.paperSize}</span>
                  </div> */}
                  <div className="space-y-1">
                    <span className="text-muted block uppercase text-[9px] font-bold">Copies</span>
                    <span className="text-text-primary font-bold block">{job.copies} Copies</span>
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
                <h3 className="text-sm font-serif font-bold text-text-primary border-b border-border/40 pb-2.5 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-accent" />
                  Transmitted Files ({job.files?.length})
                </h3>

                <div className="space-y-2.5">
                  {job.files?.map(file => {
                    const pricePerPg = file.colorPrint 
                      ? (shop?.requirements.pricePerPageColor || 10.00) 
                      : (shop?.requirements.pricePerPageBW || 2.00);
                    const filePageCount = file.pageCount || 1;
                    const fileCopies = file.copies || 1;
                    const fileCost = filePageCount * pricePerPg * fileCopies;

                    return (
                      <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-dark/60 border border-border/80 rounded-xl hover:border-accent/20 transition-all gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 text-left">
                            <span className="text-xs font-semibold text-text-primary truncate block max-w-[200px] sm:max-w-[400px]">
                              {file.originalName}
                            </span>
                            <span className="text-[10px] text-muted block mt-0.5">
                              Size: {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB • {filePageCount} {filePageCount === 1 ? 'page' : 'pages'}
                            </span>
                            <span className="inline-block mt-1 text-[9px] font-semibold bg-[#E6F4EA] text-[#137333] px-2 py-0.5 rounded">
                              {file.colorPrint ? 'Color' : 'B&W'} • {fileCopies} {fileCopies === 1 ? 'copy' : 'copies'} • {file.doubleSided ? 'Double-Sided' : 'Single-Sided'} • ₹{fileCost.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 self-start sm:self-center">
                          <button
                            onClick={() => handleDownloadFile(file.originalName, file.fileUrl)}
                            className="px-3 py-1.5 bg-surface-ink hover:bg-surface-dark border border-border rounded-lg text-xs font-semibold text-text-primary flex items-center gap-1.5 hover:text-accent hover:border-accent/40 transition-all duration-150"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                          
                          <button
                            onClick={() => handlePrintFile(file.originalName, file.fileUrl)}
                            className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-background rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-150"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Print
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right 4/12 Management Sidebar */}
            <div className="lg:col-span-4 space-y-6 animate-fade-in stagger-1">
              
              {/* Job Status Controller */}
              <div className="bg-surface-ink border border-border rounded-3xl p-6 text-left space-y-4 shadow-xl">
                <h3 className="text-sm font-serif font-extrabold text-text-primary border-b border-border/40 pb-3 flex items-center gap-2">
                  <Settings className="w-4.5 h-4.5 text-accent" />
                  Job Operations
                </h3>

                {/* Exact Price & Total Pages Summary Box */}
                <div className="p-3.5 bg-surface-dark/80 border border-border rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-medium">Total Print Pages:</span>
                    <span className="text-text-primary font-bold font-mono bg-surface-ink px-2 py-0.5 rounded border border-border">
                      {job.totalPages || 0} Pages
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-medium">Exact Price:</span>
                    <span className="text-[#00A884] font-extrabold font-mono text-sm">
                      ₹{(job.estimatedCost || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

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

                  {/* Note textarea (display only — staff notes are read-only from job data) */}
                  {staffNote && (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs text-muted font-semibold">Current Staff Note</label>
                      <div className="p-3 bg-surface-dark border border-border rounded-xl text-xs text-muted italic">
                        "{staffNote}"
                      </div>
                    </div>
                  )}

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
