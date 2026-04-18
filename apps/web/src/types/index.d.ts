export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginationResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export interface ActivityMetric {
  time: number;
  completed: number
  failed: number
}