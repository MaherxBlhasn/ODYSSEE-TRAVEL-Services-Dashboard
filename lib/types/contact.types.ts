export interface ContactDataFetch {
  id: string;
  name: string;
  familyName: string;
  Email: string;
  phone?: string;
  message: string;
  messageSentAt: string;
}

export interface QueryParams {
  search?: string;
  page: number;
  limit: number;
  sortBy?: 'Email' | 'name' | 'familyName'| 'messageSentAt' | 'phone';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ContactServices {
  getContacts: (params: QueryParams) => Promise<PaginatedResponse<ContactDataFetch>>;
  deleteContact: (id: string) => Promise<void>;
}