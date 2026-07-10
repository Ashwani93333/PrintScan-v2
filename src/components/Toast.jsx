import React, { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  // Use a ref to the latest onClose so the effect doesn't need it in deps array
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseRef.current();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]); // Only depends on duration, not the function reference

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertOctagon className="w-5 h-5 text-danger" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const borderColors = {
    success: 'border-success/30',
    error: 'border-danger/30',
    warning: 'border-amber-500/30',
    info: 'border-blue-500/30'
  };

  return (
    <div className={`flex items-center gap-3 w-full max-w-sm p-4 bg-surface-dark border ${borderColors[type]} rounded-xl shadow-2xl animate-scale-in`}>
      <div>{icons[type]}</div>
      <div className="flex-1 text-sm font-medium text-text-primary">{message}</div>
      <button 
        onClick={onClose}
        className="text-muted hover:text-text-primary transition-colors duration-150"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
