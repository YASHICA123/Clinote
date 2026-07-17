import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="space-y-1 text-left mb-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-500">{icon}</span>}
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">{title}</h4>
      </div>
      {subtitle && (
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
