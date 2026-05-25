export interface IPagination {
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  last: boolean;
}


export interface ApiResponse<T> {
  success: string;
  status: string;
  message: string;
  payload: {
    data: T;
    content: IPagination;
  };
  timestamp: string;
}