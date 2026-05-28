import React, { useState } from 'react';
import { useDb } from '../../context/DbContext';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Inbox, 
  Eye, 
  Building 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';

const SuperJobsList = () => {
  const { jobs, shops } = useDb();

  // Filters
  const [search, setSearch] = useState('');
  const [shopFilter, setShopFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter jobs platform-wide
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.customerName.toLowerCase().includes(search.toLowerCase()) || 
      job.accessToken.toLowerCase().includes(search.toLowerCase());

    const matchesShop = 
      shopFilter === 'ALL' || 
      job.shopId === shopFilter;

    const matchesStatus = 
      statusFilter === 'ALL' || 
      job.status === statusFilter;

    // Date filters
    let matchesDates = true;
    if (fromDate) {
      matchesDates = matchesDates && job.createdAt.substring(0, 10) >= fromDate;
    }
    if (toDate) {
      matchesDates = matchesDates && job.createdAt.substring(0, 10) <= toDate;
    }

    return matchesSearch && matchesShop && matchesStatus && matchesDates;
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

  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar isSuper={true} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col text-left">
        {/* Top Header */}
        <header className="px-6 h-16 border-b border-border flex items-center justify-between bg-surface-ink">
          <h1 className="text-lg font-serif font-extrabold text-white">Platform Print Jobs Auditor</h1>
          <span className="text-xs text-muted font-bold font-mono">Platform Queue: {filteredJobs.length}</span>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Platform Filters Grid */}
          <div className="bg-surface-ink border border-border p-5 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              
              {/* Search Customer/Token */}
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

              {/* Shop Destination Dropdown filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold uppercase flex-shrink-0">Shop:</span>
                <select
                  value={shopFilter}
                  onChange={(e) => {
                    setShopFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs w-full"
                >
                  <option value="ALL">All Shops</option>
                  {shops.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold uppercase flex-shrink-0">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs w-full"
                >
                  {statuses.map(st => (
                    <option key={st} value={st}>{st === 'ALL' ? 'All Statuses' : st}</option>
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
                      setCurrentPage(1);
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
                      setCurrentPage(1);
                    }}
                    className="text-xs bg-background border border-border rounded-xl"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Platform Jobs Table */}
          {filteredJobs.length === 0 ? (
            <div className="bg-surface-ink border border-border rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto py-16">
              <div className="p-4 bg-surface-dark border border-border rounded-full w-fit mx-auto text-muted">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-white">No Platform Jobs Found</h3>
              <p className="text-xs text-muted">No print jobs are currently registered matching the current platform filter bounds.</p>
            </div>
          ) : (
            <div className="bg-surface-ink border border-border rounded-3xl overflow-hidden shadow-xl animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface-dark/40 text-muted uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-4 px-4">Token</th>
                      <th className="py-4 px-4">Customer</th>
                      <th className="py-4 px-4">Shop Destination</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Pages</th>
                      <th className="py-4 px-4">Cost Parameters</th>
                      <th className="py-4 px-4">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedJobs.map(job => (
                      <tr key={job.id} className="hover:bg-surface-dark/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-accent">{job.accessToken}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{job.customerName}</td>
                        <td className="py-3.5 px-4 font-medium text-white flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          {job.shopName}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="py-3.5 px-4 text-muted font-medium">{job.totalPages || '—'} pages</td>
                        <td className="py-3.5 px-4 font-mono text-white font-semibold">
                          {job.estimatedCost !== null && job.estimatedCost !== undefined 
                            ? `₹${job.estimatedCost.toFixed(2)}` 
                            : 'Calculating...'}
                        </td>
                        <td className="py-3.5 px-4 text-muted">
                          {new Date(job.createdAt).toLocaleString()}
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
    </div>
  );
};

export default SuperJobsList;
