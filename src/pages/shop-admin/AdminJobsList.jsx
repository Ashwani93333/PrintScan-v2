import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDb } from '../../context/DbContext';
import { 
  Search, 
  Eye, 
  Trash2, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Inbox,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';

const AdminJobsList = () => {
  const { user } = useAuth();
  const { jobs, updateJob } = useDb();
  const navigate = useNavigate();

  // Shop context mapping
  const shopId = user?.shopId || "a90b4d45-ff1a-4643-982c-d9c087b322a3";
  const shopJobs = jobs.filter(j => j.shopId === shopId);

  // States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Cancellation Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Apply filters
  const filteredJobs = shopJobs.filter(job => {
    const matchesSearch = 
      job.customerName.toLowerCase().includes(search.toLowerCase()) || 
      job.accessToken.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' || 
      job.status === statusFilter;

    // Date filters check
    let matchesDates = true;
    if (fromDate) {
      matchesDates = matchesDates && job.createdAt.substring(0, 10) >= fromDate;
    }
    if (toDate) {
      matchesDates = matchesDates && job.createdAt.substring(0, 10) <= toDate;
    }

    return matchesSearch && matchesStatus && matchesDates;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCancelClick = (jobId) => {
    setSelectedJobId(jobId);
    setConfirmOpen(true);
  };

  const confirmCancellation = () => {
    if (selectedJobId) {
      updateJob(selectedJobId, { status: 'CANCELLED', adminNotes: 'Cancelled by Shop Admin.' });
      setConfirmOpen(false);
      setSelectedJobId(null);
    }
  };

  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar isSuper={false} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col text-left">
        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <h1 className="text-lg font-serif font-extrabold text-white">Print Jobs Queue</h1>
          <span className="text-xs text-muted font-bold font-mono">Records: {filteredJobs.length}</span>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Horizontal filter bar */}
          <div className="bg-surface-ink border border-border p-5 rounded-2xl space-y-4">
            
            {/* Upper line: Search and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Search customer/token */}
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer name or job token..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 text-xs bg-background border border-border focus:border-accent rounded-xl py-2.5"
                />
              </div>

              {/* Date From */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold uppercase flex-shrink-0">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs w-full bg-background border border-border rounded-xl"
                />
              </div>

              {/* Date To */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold uppercase flex-shrink-0">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs w-full bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            {/* Lower line: Status pills */}
            <div className="flex items-center gap-3 overflow-x-auto border-t border-border/40 pt-3">
              <SlidersHorizontal className="w-4 h-4 text-muted flex-shrink-0" />
              <span className="text-xs text-muted font-semibold uppercase mr-2">Status:</span>
              <div className="flex gap-1.5">
                {statuses.map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      statusFilter === st
                        ? 'bg-accent border-accent text-background font-bold'
                        : 'bg-background border-border text-muted hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Jobs Table */}
          {filteredJobs.length === 0 ? (
            <div className="bg-surface-ink border border-border rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto py-16">
              <div className="p-4 bg-surface-dark border border-border rounded-full w-fit mx-auto text-muted">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-bold text-white">No Print Jobs Found</h3>
                <p className="text-xs text-muted max-w-xs mx-auto">No print requests found matching the current search parameters.</p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-ink border border-border rounded-3xl overflow-hidden shadow-xl animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface-dark/40 text-muted uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-4 px-4">Token</th>
                      <th className="py-4 px-4">Customer Name</th>
                      <th className="py-4 px-4">Phone</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Pages (Files)</th>
                      <th className="py-4 px-4">Est. Cost</th>
                      <th className="py-4 px-4">Created At</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedJobs.map(job => (
                      <tr key={job.id} className="hover:bg-surface-dark/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-accent">{job.accessToken}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{job.customerName}</td>
                        <td className="py-3.5 px-4 font-mono text-muted">{job.customerPhone}</td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="py-3.5 px-4 text-muted font-medium">
                          {job.totalPages !== null && job.totalPages !== undefined ? `${job.totalPages} pgs` : '—'} ({job.files?.length || 0} files)
                        </td>
                        <td className="py-3.5 px-4 font-mono text-white font-semibold">
                          {job.estimatedCost !== null && job.estimatedCost !== undefined 
                            ? `₹${job.estimatedCost.toFixed(2)}` 
                            : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-muted">
                          {new Date(job.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => navigate(`/admin/jobs/${job.id}`)}
                              className="p-1.5 bg-surface-dark border border-border hover:border-accent/40 rounded-lg text-muted hover:text-white transition-all"
                              title="View/Update Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(job.status === 'PENDING' || job.status === 'PROCESSING') && (
                              <button
                                onClick={() => handleCancelClick(job.id)}
                                className="p-1.5 bg-danger/10 border border-transparent hover:border-danger/20 rounded-lg text-danger hover:bg-danger/15 transition-all"
                                title="Cancel Print Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-surface-ink border border-border p-4 rounded-2xl max-w-sm mx-auto shadow-md">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 bg-surface-dark border border-border rounded-lg text-muted hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-xs text-muted font-medium">
                Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white">{totalPages}</span>
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-surface-dark border border-border rounded-lg text-muted hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Cancellation Validation Dialog */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Cancel Print Request"
        message="Are you sure you want to cancel this print job? This action will set the job status to Cancelled and stop printing progress. It cannot be undone."
        confirmText="Yes, Cancel Job"
        cancelText="Keep Job"
        onConfirm={confirmCancellation}
        onCancel={() => setConfirmOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default AdminJobsList;
