'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by company name or industry...',
  debounceMs = 300,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const prevValueRef = useRef(value);

  // Sync internal state only when the external prop actually changes value
  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      setSearchTerm(value);
    }
  }, [value]);

  // Debounce user keystrokes only when searchTerm changes and differs from external prop
  useEffect(() => {
    if (searchTerm === prevValueRef.current) {
      return;
    }

    const handler = setTimeout(() => {
      prevValueRef.current = searchTerm;
      onChange(searchTerm);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchTerm, debounceMs, onChange]);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm('');
    prevValueRef.current = '';
    onChange('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
