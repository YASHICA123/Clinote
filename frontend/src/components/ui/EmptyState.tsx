import React from 'react';
import { type LucideIcon, FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileText,
  title,
  description,
  action
}) => {
  return (
    <div className="w-full py-12 px-4 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center text-center">
      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-4">
        <Icon size={24} />
      </div>
      <h3 className="font-semibold text-slate-800 text-xs">{title}</h3>
      <p className="text-[10px] text-slate-400 max-w-xs mt-1 leading-normal">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
