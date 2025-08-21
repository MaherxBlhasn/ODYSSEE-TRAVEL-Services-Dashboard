export interface Subscriber { id: string; email: string; }
export interface EmailRequest { subject: string; text: string; subscriberIds: string[]; }
export interface EmailAllRequest { subject: string; text: string; }
export interface SendResponse { success: boolean; message: string; count?: number; }
export interface QueryParams {
    search?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}


export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
