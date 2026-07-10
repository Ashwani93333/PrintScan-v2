import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  X, 
  Store, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Settings, 
  FileText, 
  Calendar,
  CheckCircle,
  Ban,
  Activity
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const ShopDetailModal = ({ isOpen, onClose, shopId }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && shopId) {
      setShop(null);
      setError('');
      fetchShopDetails();
    }
  }, [isOpen, shopId]);

  const fetchShopDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getSuperShopDetails(shopId);
      setShop(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch shop details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-ink border border-border rounded-3xl shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface-ink/90 backdrop-blur border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-text-primary flex items-center gap-2">
            <Store className="w-5 h-5 text-accent" />
            Shop Information
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-surface-dark border border-transparent hover:border-border rounded-lg text-muted hover:text-text-primary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-muted">Fetching shop payload...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-xs text-danger font-semibold">
              {error}
            </div>
          ) : shop ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Top Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 bg-surface-dark/40 border border-border rounded-2xl">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{shop.name}</h3>
                  <div className="text-[10px] text-muted font-mono mt-1 space-x-2">
                    <span>ID: {shop.id}</span>
                    <span className="text-accent">Slug: /{shop.slug}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex gap-2">
                    {shop.isApproved ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-success/15 border border-success/20 text-success text-[10px] font-bold">APPROVED</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold">PENDING APPROVAL</span>
                    )}
                    {shop.adminIsActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/20 text-blue-400 text-[10px] font-bold">ACTIVE ADMIN</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted/20 border border-border text-muted text-[10px] font-bold">INACTIVE ADMIN</span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined: {new Date(shop.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Grid 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Contact & Location */}
                <div className="bg-surface-ink border border-border p-4 rounded-2xl space-y-3">
                  <h4 className="font-semibold text-text-primary border-b border-border/40 pb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-accent" />
                    Location & Contact
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-muted">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{shop.address || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{shop.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted truncate">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{shop.email || 'N/A'}</span>
                    </div>
                    <div className="pt-2 text-muted text-[10px] leading-relaxed italic border-t border-border/20">
                      "{shop.description || 'No description provided'}"
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="bg-surface-ink border border-border p-4 rounded-2xl space-y-3">
                  <h4 className="font-semibold text-text-primary border-b border-border/40 pb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-400" />
                    Admin Owner
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted">
                      <span className="font-bold text-[9px] uppercase tracking-wider w-12">Name</span>
                      <span className="text-text-primary font-medium">{shop.adminName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <span className="font-bold text-[9px] uppercase tracking-wider w-12">Email</span>
                      <span className="font-mono">{shop.adminEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted pt-2 border-t border-border/20">
                      <Activity className="w-3.5 h-3.5 text-accent" />
                      <span>QR Visitors: </span>
                      <span className="font-bold text-text-primary">{shop.qrVisits || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Print Requirements (Full Width) */}
                {shop.requirements && (
                  <div className="sm:col-span-2 bg-surface-dark/30 border border-border p-4 rounded-2xl space-y-3">
                    <h4 className="font-semibold text-text-primary border-b border-border/40 pb-2 flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-success" />
                      Shop Constraints & Pricing
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                      <div className="space-y-1">
                        <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">B&W Rate</span>
                        <span className="text-text-primary font-semibold font-mono">₹{(shop.requirements.pricePerPageBW || 0).toFixed(2)}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">Color Rate</span>
                        <span className="text-text-primary font-semibold font-mono">₹{(shop.requirements.pricePerPageColor || 0).toFixed(2)}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">Max File Size</span>
                        <span className="text-text-primary font-semibold">{shop.requirements.maxFileSizeMb || 25} MB</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">Max Files/Job</span>
                        <span className="text-text-primary font-semibold">{shop.requirements.maxFilesPerJob || 5} Files</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mb-1.5">Accepted Formats</span>
                      <div className="flex flex-wrap gap-1.5">
                        {shop.requirements.acceptedFormats?.map(fmt => (
                          <span key={fmt} className="px-2 py-0.5 bg-surface-ink border border-border rounded text-[9px] font-bold uppercase text-text-primary">
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShopDetailModal;
