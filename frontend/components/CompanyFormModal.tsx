'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Globe,
  Briefcase,
  Users,
  X,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Company, CreateCompanyInput } from '@/types/company';

interface CompanyFormModalProps {
  isOpen: boolean;
  companyToEdit: Company | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCompanyInput) => Promise<void>;
}

const PRESET_INDUSTRIES = [
  'Software & SaaS',
  'Artificial Intelligence',
  'Fintech & Banking',
  'Healthcare & Biotech',
  'E-Commerce & Retail',
  'Clean Energy & Climate',
  'Cybersecurity',
  'Media & Entertainment',
  'Education & EdTech',
  'Logistics & Supply Chain',
  'Consulting & Services',
  'Hardware & Robotics',
];

export function CompanyFormModal({
  isOpen,
  companyToEdit,
  isLoading,
  onClose,
  onSubmit,
}: CompanyFormModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (companyToEdit) {
      setCompanyName(companyToEdit.companyName || '');
      setWebsite(companyToEdit.website || '');
      setIndustry(companyToEdit.industry || '');
      setEmployeeCount(
        companyToEdit.employeeCount !== null && companyToEdit.employeeCount !== undefined
          ? companyToEdit.employeeCount.toString()
          : '',
      );
    } else {
      setCompanyName('');
      setWebsite('');
      setIndustry('');
      setEmployeeCount('');
    }
    setErrors({});
    setIsIndustryDropdownOpen(false);
  }, [companyToEdit, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsIndustryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (website.trim()) {
      const urlPattern =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
      if (!urlPattern.test(website.trim())) {
        newErrors.website =
          'Please enter a valid website (e.g. https://company.com or company.com)';
      }
    }

    if (employeeCount.trim()) {
      const count = Number(employeeCount);
      if (isNaN(count) || !Number.isInteger(count) || count < 1) {
        newErrors.employeeCount = 'Employee count must be a positive whole number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let formattedWebsite = website.trim();
    if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
      formattedWebsite = `https://${formattedWebsite}`;
    }

    const payload: CreateCompanyInput = {
      companyName: companyName.trim(),
      website: formattedWebsite || null,
      industry: industry.trim() || null,
      employeeCount: employeeCount.trim() ? parseInt(employeeCount, 10) : null,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      if (err.errorMessages) {
        setErrors((prev) => ({
          ...prev,
          form: err.errorMessages.join(', '),
        }));
      }
    }
  };

  // Filtered industries matching current input text
  const filteredIndustries = PRESET_INDUSTRIES.filter((ind) =>
    ind.toLowerCase().includes(industry.toLowerCase().trim()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-heading">
                {companyToEdit ? 'Edit Company Profile' : 'Register New Company'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {companyToEdit
                  ? 'Update organizational attributes and team metrics'
                  : 'Enter company details to add to the directory'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errors.form && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. Acme Innovations"
            required
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (errors.companyName) {
                setErrors((prev) => ({ ...prev, companyName: '' }));
              }
            }}
            error={errors.companyName}
            leftIcon={<Building2 className="w-4 h-4 text-slate-500" />}
          />

          <Input
            label="Website URL"
            placeholder="e.g. https://acme.com"
            value={website}
            onChange={(e) => {
              setWebsite(e.target.value);
              if (errors.website) {
                setErrors((prev) => ({ ...prev, website: '' }));
              }
            }}
            error={errors.website}
            helperText="Protocol (https://) is added automatically if omitted"
            leftIcon={<Globe className="w-4 h-4 text-slate-500" />}
          />

          {/* Custom Modern Industry Selector */}
          <div className="space-y-1.5" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Industry Vertical
              </label>
              {industry && (
                <button
                  type="button"
                  onClick={() => setIndustry('')}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-3 top-2.5 flex items-center pointer-events-none text-slate-500">
                <Briefcase className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={industry}
                onFocus={() => setIsIndustryDropdownOpen(true)}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setIsIndustryDropdownOpen(true);
                }}
                placeholder="Select or type custom sector..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-10 pr-9 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />

              <button
                type="button"
                onClick={() => setIsIndustryDropdownOpen((prev) => !prev)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isIndustryDropdownOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Popover */}
              {isIndustryDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto bg-slate-900/95 border border-slate-700/90 rounded-xl shadow-2xl backdrop-blur-xl p-1.5 animate-slide-up">
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Popular Verticals</span>
                  </div>

                  <div className="space-y-0.5 mt-1">
                    {filteredIndustries.length > 0 ? (
                      filteredIndustries.map((item) => {
                        const isSelected = industry.toLowerCase() === item.toLowerCase();
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setIndustry(item);
                              setIsIndustryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                              isSelected
                                ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">
                        No presets match &quot;{industry}&quot;. Press Save to use as custom industry.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick-Pick Sector Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Software & SaaS', 'Artificial Intelligence', 'Fintech & Banking', 'Healthcare & Biotech'].map(
                (quickSector) => (
                  <button
                    key={quickSector}
                    type="button"
                    onClick={() => setIndustry(quickSector)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      industry.toLowerCase() === quickSector.toLowerCase()
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {quickSector}
                  </button>
                ),
              )}
            </div>
          </div>

          <Input
            label="Total Employee Count"
            placeholder="e.g. 150"
            type="number"
            min="1"
            step="1"
            value={employeeCount}
            onChange={(e) => {
              setEmployeeCount(e.target.value);
              if (errors.employeeCount) {
                setErrors((prev) => ({ ...prev, employeeCount: '' }));
              }
            }}
            error={errors.employeeCount}
            leftIcon={<Users className="w-4 h-4 text-slate-500" />}
          />

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {companyToEdit ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
