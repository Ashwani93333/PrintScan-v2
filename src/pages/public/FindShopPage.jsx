import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Inbox, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const FindShopPage = () => {
  const { shops } = useDb();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter approved and active shops only
  const activeShops = shops.filter(shop => shop.isApproved && shop.isActive);

  // Apply search & format filters
  const filteredShops = activeShops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(search.toLowerCase()) || 
      shop.address.toLowerCase().includes(search.toLowerCase());
    
    const matchesFormat = 
      formatFilter === 'ALL' || 
      shop.requirements.acceptedFormats.includes(formatFilter.toUpperCase());

    return matchesSearch && matchesFormat;
  });

  // Calculate pagination
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

  const allAvailableFormats = ['ALL', 'PDF', 'JPG', 'PNG', 'DOCX'];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
          {/* Page Header */}
          <div className="text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">Find a Print Shop</h1>
            <p className="text-sm text-muted">Locate nearby print hubs, check active rates, formats, and send print jobs instantly.</p>
          </div>

          {/* Search and Filters panel */}
          <div className="p-4 bg-surface-ink border border-border rounded-2xl flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by shop name, landmark, or area..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 text-sm bg-background border border-border focus:border-accent rounded-xl py-2.5"
              />
            </div>

            {/* Formats filter pill row */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1">
              <SlidersHorizontal className="w-4 h-4 text-muted flex-shrink-0" />
              <span className="text-xs text-muted font-semibold uppercase mr-1">Formats:</span>
              <div className="flex gap-1.5">
                {allAvailableFormats.map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFormatFilter(fmt);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                      formatFilter === fmt
                        ? 'bg-accent border-accent text-background font-bold'
                        : 'bg-surface-dark border-border text-muted hover:text-white hover:border-border/80'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results grid */}
          {filteredShops.length === 0 ? (
            /* Animated Empty State */
            <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-ink border border-border rounded-3xl space-y-4 max-w-lg mx-auto py-16 animate-scale-in">
              <div className="p-4 bg-surface-dark rounded-full border border-border text-muted animate-pulse">
                <Inbox className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-white">No Print Shops Found</h3>
                <p className="text-sm text-muted max-w-sm">
                  We couldn't find any approved or active shops matching "{search || formatFilter}". Try refining your keywords.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedShops.map((shop, idx) => (
                /* Card Layout with hover lift animation */
                <div 
                  key={shop.id}
                  className="bg-surface-ink border border-border rounded-2xl p-6 flex flex-col justify-between gap-6 hover:-translate-y-1.5 hover:border-accent/40 shadow-xl transition-all duration-300 animate-fade-up stagger-1"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-left space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-serif font-bold text-white truncate flex-1 leading-snug">
                          {shop.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
                          OPEN
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {shop.description || 'Professional document printing services available.'}
                      </p>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2 text-xs text-muted text-left border-y border-border/40 py-3.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        <span className="truncate">{shop.address}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                        <span className="truncate">{shop.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                        <span className="truncate">{shop.email}</span>
                      </div>
                    </div>

                    {/* Price and Format Badges */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-[10px] text-muted font-bold tracking-wider uppercase">Page Pricing:</span>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 rounded bg-surface-dark border border-border text-xs text-white font-semibold">
                            ₹{shop.requirements.pricePerPageBW.toFixed(2)} <span className="text-[9px] text-muted font-normal">B&W</span>
                          </span>
                          <span className="px-2 py-1 rounded bg-surface-dark border border-border text-xs text-accent font-semibold">
                            ₹{shop.requirements.pricePerPageColor.toFixed(2)} <span className="text-[9px] text-muted font-normal">Color</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-[10px] text-muted font-bold tracking-wider uppercase">Accepted:</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                          {shop.requirements.acceptedFormats.map(fmt => (
                            <span key={fmt} className="px-1.5 py-0.5 rounded bg-surface-dark text-[9px] font-bold text-muted border border-border/60">
                              {fmt}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* File Constraints info banner */}
                      <div className="flex items-center gap-2 text-[10px] text-muted bg-surface-dark/40 px-2.5 py-1.5 rounded-lg border border-border/40">
                        <Info className="w-3 h-3 text-accent flex-shrink-0" />
                        <span>Max file: {shop.requirements.maxFileSizeMb}MB • Max files/job: {shop.requirements.maxFilesPerJob}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/20">
                    <button
                      onClick={() => navigate(`/shops/${shop.slug}`)}
                      className="w-full py-2.5 text-xs font-semibold bg-accent text-background hover:bg-accent-hover rounded-xl flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-accent/5 transition-all duration-150"
                    >
                      Upload & Print Files
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-surface-ink border border-border p-4 rounded-2xl max-w-sm mx-auto">
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

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 mt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-muted flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} PrintEase. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/register" className="hover:text-white">Register Shop</Link>
        </div>
      </footer>
    </div>
  );
};

export default FindShopPage;
