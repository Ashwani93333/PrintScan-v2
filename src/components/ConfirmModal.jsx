import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-dark border border-border rounded-2xl shadow-2xl p-6 overflow-hidden animate-scale-in">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDanger ? 'bg-danger/10 text-danger' : 'bg-amber-500/10 text-amber-500'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">{title}</h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-muted hover:text-white transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-muted mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-surface-ink border border-border text-white hover:bg-primary/20 transition-all duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-150 ${
              isDanger 
                ? 'bg-danger hover:bg-danger/85 hover:shadow-lg hover:shadow-danger/10' 
                : 'bg-accent hover:bg-accent/85 hover:shadow-lg hover:shadow-accent/10 text-background'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
