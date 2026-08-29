import React from 'react';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toUpperCase();

  if (normalized === 'ICU') {
    return (
      <Badge
        variant="info"
        className={`px-2 py-0.5 font-bold uppercase rounded-md text-[9px] ${className}`}
        style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#DBEAFE' }}
      >
        ICU
      </Badge>
    );
  }

  if (normalized === 'WARD') {
    return (
      <Badge
        variant="purple"
        className={`px-2 py-0.5 font-bold uppercase rounded-md text-[9px] ${className}`}
        style={{ backgroundColor: '#F5F3FF', color: '#6D28D9', borderColor: '#EDE9FE' }}
      >
        WARD
      </Badge>
    );
  }

  if (normalized === 'ACTIVE' || normalized === 'ADMITTED') {
    return (
      <Badge
        variant="success"
        className={`px-2.5 py-0.5 font-semibold rounded-full flex items-center gap-1 text-[9px] ${className}`}
      >
        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
        Active
      </Badge>
    );
  }

  if (normalized === 'DISCHARGED') {
    return (
      <Badge
        variant="secondary"
        className={`px-2.5 py-0.5 font-semibold rounded-full text-[9px] ${className}`}
      >
        Discharged
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`px-2 py-0.5 rounded-md text-[9px] ${className}`}>
      {status}
    </Badge>
  );
};
