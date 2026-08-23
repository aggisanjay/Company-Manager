import {
  Company,
  CompanyMetrics,
  CompanyQueryParams,
  CreateCompanyInput,
  PaginatedCompaniesResponse,
  UpdateCompanyInput,
} from '@/types/company';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  statusCode: number;
  errorMessages: string[];

  constructor(statusCode: number, message: string | string[]) {
    const formattedMessage = Array.isArray(message)
      ? message.join(', ')
      : message;
    super(formattedMessage);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorMessages = Array.isArray(message) ? message : [message];
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || 'An unexpected error occurred' };
      }

      throw new ApiError(
        response.status,
        errorData.message || `Request failed with status ${response.status}`,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        0,
        'Cannot connect to the backend server. Please verify the NestJS API is running on ' +
          API_BASE_URL,
      );
    }

    throw new ApiError(500, (error as Error).message || 'Network request failed');
  }
}

export const api = {
  getCompanies: async (
    params: CompanyQueryParams = {},
  ): Promise<PaginatedCompaniesResponse> => {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.order) searchParams.set('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/companies${queryString ? `?${queryString}` : ''}`;
    return request<PaginatedCompaniesResponse>(endpoint);
  },

  getMetrics: async (): Promise<CompanyMetrics> => {
    return request<CompanyMetrics>('/companies/metrics');
  },

  getCompanyById: async (id: string): Promise<Company> => {
    return request<Company>(`/companies/${id}`);
  },

  createCompany: async (data: CreateCompanyInput): Promise<Company> => {
    return request<Company>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCompany: async (
    id: string,
    data: UpdateCompanyInput,
  ): Promise<Company> => {
    return request<Company>(`/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteCompany: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/companies/${id}`, {
      method: 'DELETE',
    });
  },
};
