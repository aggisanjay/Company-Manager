'use client';

import React from 'react';
import { Building2, Users, TrendingUp, Layers } from 'lucide-react';
import { CompanyMetrics } from '@/types/company';
import { formatNumber } from '@/lib/utils';
import { Badge } from './ui/Badge';

interface MetricsOverviewProps {
  metrics: CompanyMetrics | null;
  isLoading: boolean;
}

export function MetricsOverview({ metrics, isLoading }: MetricsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-900/60 border border-slate-800/80 rounded-2xl animate-pulse p-4"
          />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Total Companies */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 hover:border-emerald-500/30">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Tracked Companies
          </p>
          <h3 className="text-2xl font-bold text-slate-100 mt-0.5 font-heading">
            {formatNumber(metrics.totalCompanies)}
          </h3>
        </div>
      </div>

      {/* Metric 2: Total Workforce */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 hover:border-sky-500/30">
        <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Total Workforce
          </p>
          <h3 className="text-2xl font-bold text-slate-100 mt-0.5 font-heading">
            {formatNumber(metrics.totalEmployees)}
          </h3>
        </div>
      </div>

      {/* Metric 3: Average Team Size */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 hover:border-purple-500/30">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Avg Team Size
          </p>
          <h3 className="text-2xl font-bold text-slate-100 mt-0.5 font-heading">
            {formatNumber(metrics.averageEmployees)}
          </h3>
        </div>
      </div>

      {/* Metric 4: Top Sectors */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-200 hover:border-amber-500/30">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Top Sector
          </p>
          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
            {metrics.topIndustries.length > 0 ? (
              <Badge variant="warning" size="sm" className="truncate max-w-[140px]">
                {metrics.topIndustries[0].name} ({metrics.topIndustries[0].count})
              </Badge>
            ) : (
              <span className="text-xs text-slate-500">None yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
