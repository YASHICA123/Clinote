import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide transition-colors duration-200';
  
  const variants = {
    default: 'bg-slate-900 text-white',
    secondary: 'bg-slate-100 text-slate-700',
    outline: 'border border-slate-200 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100/50',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100/50',
    error: 'bg-red-50 text-red-700 border border-red-100/50',
    info: 'bg-blue-50 text-blue-700 border border-blue-100/50',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100/50'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
