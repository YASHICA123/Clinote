import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullscreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  label = 'Loading clinical data...', 
  fullscreen = false 
}) => {
  const spinnerSizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const containerStyles = fullscreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center'
    : 'w-full py-12 flex flex-col items-center justify-center';

  return (
    <div className={containerStyles}>
      <div className={`animate-spin rounded-full border-t-emerald-600 border-r-emerald-200 border-b-emerald-200 border-l-emerald-200 ${spinnerSizes[size]}`} />
      {label && <p className="mt-3 text-xs text-slate-400 font-medium animate-pulse">{label}</p>}
    </div>
  );
};
