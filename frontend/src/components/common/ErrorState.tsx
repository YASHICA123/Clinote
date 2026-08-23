import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-12 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
      <div className="p-3 bg-red-50 rounded-2xl">
        <AlertCircle className="text-red-500" size={24} />
      </div>
      <div className="space-y-1">
        <h4 className="font-extrabold text-sm text-slate-900">{title}</h4>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="rounded-xl px-4 py-2 font-bold text-[10px]">
          Try Again
        </Button>
      )}
    </div>
  );
};
