import React from 'react';
import { Button } from '../ui/Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'primary';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-slate-100 shadow-xl space-y-4 text-left">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-slate-900">{title}</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button onClick={onClose} variant="ghost" size="sm" className="font-bold text-[10px] rounded-xl px-4 py-2 hover:bg-slate-50 text-slate-500">
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant={type === 'danger' ? 'danger' : 'primary'}
            size="sm"
            className={`font-bold text-[10px] rounded-xl px-4 py-2 text-white shadow-sm ${type === 'danger'
                ? 'bg-red-500 hover:bg-red-650'
                : 'bg-emerald-600 hover:bg-emerald-650'
              }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
