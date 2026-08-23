import React from 'react';

interface StatusPillProps {
  status: string;
  type?: 'success' | 'warning' | 'info' | 'error' | 'default';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, type = 'default' }) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100/50';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-100/50';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-100/50';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-100/50';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100/50';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getColors()}`}>
      {status}
    </span>
  );
};
