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

export interface ApiFlatResponse<T> {
  success: string;
  status: string;
  message: string;
  payload: T;
  timestamp: string;
}

// For endpoints that return raw Spring Page<T> (e.g. Purchase, Sale)
export interface ISpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}

export interface ApiSpringPageResponse<T> {
  success: string;
  status: string;
  message: string;
  payload: ISpringPage<T>;
  timestamp: string;
}