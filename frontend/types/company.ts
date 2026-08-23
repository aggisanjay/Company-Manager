export interface Company {
  id: string;
  companyName: string;
  website: string | null;
  industry: string | null;
  employeeCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedCompaniesResponse {
  data: Company[];
  meta: PaginationMeta;
}

export interface CompanyMetrics {
  totalCompanies: number;
  totalEmployees: number;
  averageEmployees: number;
  topIndustries: Array<{ name: string; count: number }>;
}

export type SortByField = 'companyName' | 'employeeCount' | 'createdAt' | 'industry';
export type SortOrder = 'asc' | 'desc';

export interface CompanyQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortByField;
  order?: SortOrder;
}

export interface CreateCompanyInput {
  companyName: string;
  website?: string | null;
  industry?: string | null;
  employeeCount?: number | null;
}

export interface UpdateCompanyInput extends Partial<CreateCompanyInput> {}
