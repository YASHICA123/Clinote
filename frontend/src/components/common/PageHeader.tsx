import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100/80 mb-6 text-left">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};
