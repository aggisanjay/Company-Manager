'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginationMeta } from '@/types/company';
import { Button } from './ui/Button';

interface PaginationControlsProps {
  currentPage: number;
  currentLimit?: number;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  disabled?: boolean;
}

export function PaginationControls({
  currentPage,
  currentLimit,
  meta,
  onPageChange,
  onLimitChange,
  disabled = false,
}: PaginationControlsProps) {
  const { totalPages, total } = meta;
  const page = Math.max(1, currentPage);
  const limit = currentLimit || meta.limit || 7;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = 4;
      } else if (page >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push('...');

      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-slate-400">
      {/* Result stats & page size */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div>
          Showing <span className="font-semibold text-slate-200">{startItem}</span> to{' '}
          <span className="font-semibold text-slate-200">{endItem}</span> of{' '}
          <span className="font-semibold text-slate-200">{total}</span> entries
        </div>

        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Per page:</span>
            <select
              value={limit}
              disabled={disabled}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                if (!isNaN(newLimit) && newLimit > 0) {
                  onLimitChange(newLimit);
                }
              }}
              aria-label="Items per page"
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            >
              <option value={7}>7</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination navigation buttons */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) onPageChange(1);
          }}
          disabled={disabled || page <= 1}
          aria-label="First page"
          className="px-2"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) onPageChange(page - 1);
          }}
          disabled={disabled || page <= 1}
          aria-label="Previous page"
          className="px-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.preventDefault();
                  if (p !== page) onPageChange(p);
                }}
                className={`min-w-[32px] h-8 text-xs font-semibold rounded-lg transition-all ${
                  p === page
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 disabled:opacity-50'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-slate-600 select-none">
                {p}
              </span>
            ),
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) onPageChange(page + 1);
          }}
          disabled={disabled || page >= totalPages}
          aria-label="Next page"
          className="px-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) onPageChange(totalPages);
          }}
          disabled={disabled || page >= totalPages}
          aria-label="Last page"
          className="px-2"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
