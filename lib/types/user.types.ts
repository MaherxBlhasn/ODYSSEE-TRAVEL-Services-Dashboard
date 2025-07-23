export interface UserDataFetch {
  id: string;
  username: string;
  Email: string;
  phone?: string;
  createdAt: string;
}
export interface UserData {
  id: string;
  username: string;
  Email: string;
  phone?: string;
  password:string;
  createdAt: string;
}

export interface QueryParams {
  search?: string;
  page: number;
  limit: number;
  sortBy?: 'Email' | 'username' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserServices {
  getUsers: (params: QueryParams) => Promise<PaginatedResponse<UserDataFetch>>;
  createUser: (user: Omit<UserData, 'id' | 'createdAt'>) => Promise<UserData>;
  updateUser: (id: string, user: Partial<Omit<UserData, 'id' | 'createdAt'>>) => Promise<UserData>;
  deleteUser: (id: string) => Promise<void>;
}