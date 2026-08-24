'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Plus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  Company,
  CompanyMetrics,
  PaginationMeta,
  SortByField,
  SortOrder,
  CreateCompanyInput,
} from '@/types/company';
import { api, ApiError } from '@/lib/api';
import { MetricsOverview } from '@/components/MetricsOverview';
import { SearchBar } from '@/components/SearchBar';
import { CompanyTable } from '@/components/CompanyTable';
import { PaginationControls } from '@/components/PaginationControls';
import { CompanyFormModal } from '@/components/CompanyFormModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Button } from '@/components/ui/Button';
import { ToastProvider, useToast } from '@/components/ui/Toast';

function DashboardContent() {
  const { toast } = useToast();

  // State: Query Controls
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortByField>('createdAt');
  const [order, setOrder] = useState<SortOrder>('desc');

  // State: Data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [metrics, setMetrics] = useState<CompanyMetrics | null>(null);

  // State: Loading & Error
  const [isLoading, setIsLoading] = useState(true);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State: Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Companies
  const fetchCompaniesData = useCallback(
    async (
      targetPage: number,
      targetLimit: number,
      targetSearch: string,
      targetSortBy: SortByField,
      targetOrder: SortOrder,
    ) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await api.getCompanies({
          page: targetPage,
          limit: targetLimit,
          search: targetSearch.trim() || undefined,
          sortBy: targetSortBy,
          order: targetOrder,
        });

        setCompanies(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to fetch companies';
        setErrorMessage(message);
        toast({
          type: 'error',
          title: 'Error loading directory',
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  // Fetch Metrics
  const fetchMetricsData = useCallback(async () => {
    setIsMetricsLoading(true);
    try {
      const data = await api.getMetrics();
      setMetrics(data);
    } catch {
      // Non-critical, fail silently for metrics
    } finally {
      setIsMetricsLoading(false);
    }
  }, []);

  // Primary Data Effect
  useEffect(() => {
    fetchCompaniesData(page, limit, search, sortBy, order);
  }, [page, limit, search, sortBy, order, fetchCompaniesData]);

  // Initial Metrics Effect
  useEffect(() => {
    fetchMetricsData();
  }, [fetchMetricsData]);

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (field: SortByField) => {
      if (sortBy === field) {
        setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setOrder('asc');
      }
    },
    [sortBy],
  );

  const handleRefresh = useCallback(() => {
    fetchCompaniesData(page, limit, search, sortBy, order);
    fetchMetricsData();
  }, [page, limit, search, sortBy, order, fetchCompaniesData, fetchMetricsData]);

  // Handlers: Create / Update
  const handleOpenCreate = () => {
    setCompanyToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (company: Company) => {
    setCompanyToEdit(company);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateCompanyInput) => {
    setIsSaving(true);
    try {
      if (companyToEdit) {
        const updated = await api.updateCompany(companyToEdit.id, data);
        toast({
          type: 'success',
          title: 'Company updated',
          description: `${updated.companyName} profile was successfully saved.`,
        });
      } else {
        const created = await api.createCompany(data);
        toast({
          type: 'success',
          title: 'Company registered',
          description: `${created.companyName} has been added to the directory.`,
        });
      }

      setIsFormModalOpen(false);
      setCompanyToEdit(null);
      fetchCompaniesData(page, limit, search, sortBy, order);
      fetchMetricsData();
    } catch (err: any) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to save company';
      toast({
        type: 'error',
        title: 'Operation failed',
        description: message,
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers: Delete
  const handleOpenDelete = (company: Company) => {
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    setIsDeleting(true);
    try {
      await api.deleteCompany(companyToDelete.id);
      toast({
        type: 'success',
        title: 'Company removed',
        description: `${companyToDelete.companyName} has been deleted.`,
      });

      setIsDeleteModalOpen(false);
      setCompanyToDelete(null);

      const newPage = companies.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      fetchCompaniesData(newPage, limit, search, sortBy, order);
      fetchMetricsData();
    } catch (err: any) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to delete company';
      toast({
        type: 'error',
        title: 'Deletion failed',
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-16">
      {/* Top Navigation / App Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Stack Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[1px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-bold tracking-tight text-white font-heading">
                  Company Manager
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Styled Tech Stack Pills */}
              <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                  Supabase Postgres
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
                  NestJS
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />
                  Next.js App Router
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600 shadow-sm"
              leftIcon={
                <RefreshCw
                  className={`w-3.5 h-3.5 text-slate-300 ${
                    isLoading ? 'animate-spin text-emerald-400' : ''
                  }`}
                />
              }
            >
              <span className="hidden sm:inline">Sync</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Company
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Analytics & Metrics */}
        <MetricsOverview metrics={metrics} isLoading={isMetricsLoading} />

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start justify-between gap-3 text-rose-200 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">Backend Connection Note</p>
                <p className="text-xs text-rose-300/80 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Control Bar: Search & Quick stats */}
        <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search companies by name or industry..."
            />
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between sm:justify-end gap-2 px-1">
            <span>
              Sorting by{' '}
              <span className="font-semibold text-slate-200">
                {sortBy === 'companyName'
                  ? 'Company Name'
                  : sortBy === 'employeeCount'
                  ? 'Employees'
                  : sortBy === 'industry'
                  ? 'Industry'
                  : 'Created At'}
              </span>{' '}
              ({order.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Directory Table */}
        <CompanyTable
          companies={companies}
          isLoading={isLoading}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        {/* Pagination Controls */}
        {meta.total > 0 && (
          <PaginationControls
            currentPage={page}
            currentLimit={limit}
            meta={meta}
            disabled={isLoading}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </main>

      {/* Modals */}
      <CompanyFormModal
        isOpen={isFormModalOpen}
        companyToEdit={companyToEdit}
        isLoading={isSaving}
        onClose={() => {
          setIsFormModalOpen(false);
          setCompanyToEdit(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        company={companyToDelete}
        isLoading={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
