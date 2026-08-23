import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading Clinote...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-emerald-600" size={32} />
      <span className="text-xs font-black text-slate-800 tracking-tight">{message}</span>
    </div>
  );
};
