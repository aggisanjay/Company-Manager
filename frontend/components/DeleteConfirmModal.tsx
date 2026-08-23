'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Company } from '@/types/company';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  company: Company | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  company,
  isLoading,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Delete Company</h3>
              <p className="text-xs text-slate-400 mt-0.5">This action is permanent.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-sm text-slate-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-rose-300 underline decoration-rose-500/40">
            {company.companyName}
          </span>
          ? All associated records will be removed immediately.
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
