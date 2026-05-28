import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { 
  Search, 
  Plus, 
  Trash2, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Inbox, 
  Check, 
  X,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const SuperShopsList = () => {
  const { shops, approveShop, toggleShopActive, deleteShop } = useDb();
  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [approvedFilter, setApprovedFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog & Feedback states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState({ id: '', name: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Filter shops
  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(search.toLowerCase()) || 
      shop.adminEmail.toLowerCase().includes(search.toLowerCase());

    const matchesActive = 
      activeFilter === 'ALL' || 
      (activeFilter === 'ACTIVE' && shop.isActive) ||
      (activeFilter === 'INACTIVE' && !shop.isActive);

    const matchesApproved = 
      approvedFilter === 'ALL' || 
      (approvedFilter === 'APPROVED' && shop.isApproved) ||
      (approvedFilter === 'PENDING' && !shop.isApproved);

    return matchesSearch && matchesActive && matchesApproved;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const paginatedShops = filteredShops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleApproveAction = (shopId, shopName) => {
    approveShop(shopId);
    setToastType('success');
    setToastMessage(`Shop "${shopName}" has been approved successfully!`);
  };

  const handleToggleActiveAction = (shopId, shopName) => {
    toggleShopActive(shopId);
    setToastType('info');
    setToastMessage(`Toggled active status for "${shopName}".`);
  };

  const handleDeleteClick = (shopId, shopName) => {
    setSelectedShop({ id: shopId, name: shopName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedShop.id) {
      deleteShop(selectedShop.id);
      setConfirmOpen(false);
      setToastType('error');
      setToastMessage(`Shop "${selectedShop.name}" deleted from platform database.`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
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
          <h1 className="text-lg font-serif font-extrabold text-white">Registered Print Shops</h1>
          
          <Link
            to="/superadmin/shops/new"
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-background text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-background" />
            Create New Shop
          </Link>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Filters Bar */}
          <div className="bg-surface-ink border border-border p-5 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by shop name or owner email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 text-xs bg-background border border-border focus:border-accent rounded-xl py-2.5"
                />
              </div>

              {/* Active Filter dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold uppercase flex-shrink-0">Active:</span>
                <select
                  value={activeFilter}
                  onChange={(e) => {
                    setActiveFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs w-full"
                >
                  <option value="ALL">All Shops</option>
                  <option value="ACTIVE">Currently Active</option>
                  <option value="INACTIVE">Inactive / Hidden</option>
                </select>
              </div>

              {/* Approved Filter dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold uppercase flex-shrink-0">Approval:</span>
                <select
                  value={approvedFilter}
                  onChange={(e) => {
                    setApprovedFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs w-full"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved Only</option>
                  <option value="PENDING">Pending Review</option>
                </select>
              </div>

            </div>
          </div>

          {/* Table display */}
          {filteredShops.length === 0 ? (
            <div className="bg-surface-ink border border-border rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto py-16">
              <div className="p-4 bg-surface-dark border border-border rounded-full w-fit mx-auto text-muted">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-white">No Shops Found</h3>
              <p className="text-xs text-muted">Refine your query parameters or register a new print shop partner.</p>
            </div>
          ) : (
            <div className="bg-surface-ink border border-border rounded-3xl overflow-hidden shadow-xl animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface-dark/40 text-muted uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-4 px-4">Shop Name</th>
                      <th className="py-4 px-4">Owner Name</th>
                      <th className="py-4 px-4">Owner Email</th>
                      <th className="py-4 px-4">Slug URL</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-4 text-center">Approved</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedShops.map(shop => (
                      <tr key={shop.id} className="hover:bg-surface-dark/30 transition-colors">
                        <td className="py-3.5 px-4 font-serif font-bold text-white">{shop.name}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{shop.adminName}</td>
                        <td className="py-3.5 px-4 font-mono text-muted">{shop.adminEmail}</td>
                        <td className="py-3.5 px-4 font-mono text-accent">/shops/{shop.slug}</td>
                        <td className="py-3.5 px-4 text-center">
                          {shop.isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-success/15 border border-success/20 text-success text-[10px] font-bold">ACTIVE</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-danger/10 border border-danger/20 text-danger text-[10px] font-bold">INACTIVE</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {shop.isApproved ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-success/10 text-success border border-success/20 text-[10px] font-bold">APPROVED</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold">PENDING</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex gap-2 justify-end items-center">
                            {/* Approve button shortcut if pending */}
                            {!shop.isApproved && (
                              <button
                                onClick={() => handleApproveAction(shop.id, shop.name)}
                                className="p-1.5 bg-success/10 border border-transparent hover:border-success/20 rounded-lg text-success hover:bg-success/20 transition-all"
                                title="Approve Shop"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {/* Active Toggle Switch */}
                            <button
                              onClick={() => handleToggleActiveAction(shop.id, shop.name)}
                              className="p-1 text-muted hover:text-white transition-all"
                              title={shop.isActive ? 'Deactivate Shop' : 'Activate Shop'}
                            >
                              {shop.isActive ? (
                                <ToggleRight className="w-6 h-6 text-success" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-muted" />
                              )}
                            </button>

                            {/* Delete Shop button */}
                            <button
                              onClick={() => handleDeleteClick(shop.id, shop.name)}
                              className="p-1.5 bg-danger/10 border border-transparent hover:border-danger/25 rounded-lg text-danger hover:bg-danger/20 transition-all"
                              title="Delete Shop Partner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      {/* Confirmation delete modal dialog */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Shop Partner"
        message={`Are you sure you want to permanently delete "${selectedShop.name}"? This action will immediately deactivate their public dashboard, delete their routing slug, and purge all their printed jobs. It cannot be recovered.`}
        confirmText="Confirm Deletion"
        cancelText="Abort"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default SuperShopsList;
