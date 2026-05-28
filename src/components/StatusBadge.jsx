import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-500 border-amber-500/20',
      label: 'Pending Approval'
    },
    PROCESSING: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400 border-blue-500/20',
      label: 'Processing'
    },
    COMPLETED: {
      bg: 'bg-success/10',
      text: 'text-success border-success/20',
      label: 'Ready for Collection'
    },
    CANCELLED: {
      bg: 'bg-danger/10',
      text: 'text-danger border-danger/20',
      label: 'Cancelled'
    }
  };

  const current = statusStyles[status?.toUpperCase()] || {
    bg: 'bg-muted/10',
    text: 'text-muted border-muted/20',
    label: status || 'Unknown'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {current.label}
    </span>
  );
};

export default StatusBadge;
