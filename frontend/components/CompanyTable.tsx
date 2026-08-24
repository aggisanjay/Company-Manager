'use client';

import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Edit2,
  Trash2,
  Building,
  Globe,
  Briefcase,
  Users,
  Calendar,
} from 'lucide-react';
import { Company, SortByField, SortOrder } from '@/types/company';
import { formatDate, formatNumber, formatUrl } from '@/lib/utils';
import { Badge } from './ui/Badge';

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  sortBy: SortByField;
  order: SortOrder;
  onSort: (field: SortByField) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompanyTable({
  companies,
  isLoading,
  sortBy,
  order,
  onSort,
  onEdit,
  onDelete,
}: CompanyTableProps) {
  const renderSortIcon = (field: SortByField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />;
    }
    return order === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
              {/* Company Name */}
              <th className="py-3.5 px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => onSort('companyName')}
                  className="group flex items-center gap-2 hover:text-slate-200 transition-colors focus:outline-none"
                >
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Company</span>
                  {renderSortIcon('companyName')}
                </button>
              </th>

              {/* Website */}
              <th className="py-3.5 px-4 hidden md:table-cell">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Website</span>
                </div>
              </th>

              {/* Industry */}
              <th className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => onSort('industry')}
                  className="group flex items-center gap-2 hover:text-slate-200 transition-colors focus:outline-none"
                >
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>Industry</span>
                  {renderSortIcon('industry')}
                </button>
              </th>

              {/* Employees */}
              <th className="py-3.5 px-4 text-right">
                <button
                  type="button"
                  onClick={() => onSort('employeeCount')}
                  className="group inline-flex items-center gap-2 hover:text-slate-200 transition-colors focus:outline-none ml-auto"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Employees</span>
                  {renderSortIcon('employeeCount')}
                </button>
              </th>

              {/* Created At */}
              <th className="py-3.5 px-4 hidden lg:table-cell text-right">
                <button
                  type="button"
                  onClick={() => onSort('createdAt')}
                  className="group inline-flex items-center gap-2 hover:text-slate-200 transition-colors focus:outline-none ml-auto"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>CreatedAt</span>
                  {renderSortIcon('createdAt')}
                </button>
              </th>

              {/* Actions */}
              <th className="py-3.5 px-4 sm:px-6 text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className={`divide-y divide-slate-800/60 text-sm transition-opacity duration-200 ${isLoading && companies.length > 0 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {isLoading && companies.length === 0 ? (
              // Loading Skeleton Rows
              Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-4 bg-slate-800 rounded w-36 mb-1.5" />
                    <div className="h-3 bg-slate-800/60 rounded w-24 md:hidden" />
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <div className="h-4 bg-slate-800 rounded w-28" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 bg-slate-800 rounded-full w-24" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-slate-800 rounded w-12 ml-auto" />
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell text-right">
                    <div className="h-4 bg-slate-800 rounded w-20 ml-auto" />
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="h-7 bg-slate-800 rounded w-16 ml-auto" />
                  </td>
                </tr>
              ))
            ) : companies.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={6} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                      <Building className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-200">
                      No companies found
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      No matching records match your search or filter criteria. Try adjusting your search query or add a new company.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              companies.map((company) => {
                const websiteInfo = formatUrl(company.website);

                return (
                  <tr
                    key={company.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Company Name */}
                    <td className="py-4 px-4 sm:px-6 font-medium text-slate-100">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {company.companyName}
                        </span>
                        {websiteInfo && (
                          <a
                            href={websiteInfo.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors md:hidden inline-flex items-center gap-1 mt-0.5"
                          >
                            <span>{websiteInfo.display}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Website */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      {websiteInfo ? (
                        <a
                          href={websiteInfo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 hover:underline transition-colors max-w-[200px] truncate"
                        >
                          <span className="truncate">{websiteInfo.display}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 text-slate-500" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>

                    {/* Industry */}
                    <td className="py-4 px-4">
                      {company.industry ? (
                        <Badge variant="slate" size="sm">
                          {company.industry}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500">Unspecified</span>
                      )}
                    </td>

                    {/* Employees */}
                    <td className="py-4 px-4 text-right">
                      {company.employeeCount !== null && company.employeeCount !== undefined ? (
                        <span className="font-medium text-slate-200">
                          {formatNumber(company.employeeCount)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 hidden lg:table-cell text-right text-xs text-slate-400">
                      {formatDate(company.createdAt)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(company)}
                          title="Edit company"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(company)}
                          title="Delete company"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
