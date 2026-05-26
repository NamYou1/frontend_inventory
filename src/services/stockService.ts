import api from '@/api/axios';
import type { ApiResponse } from '@/utils/Pagination';
import type { Stock } from '@/types/Stock.type';

export const fetchStocks = (params: Record<string, string | number> = {}): Promise<ApiResponse<Stock[]>> => {
  return api.get('stocks', { params }).then((res) => res.data);
};

export const fetchStockById = (id: number): Promise<Stock> => {
  return api.get(`stocks/${id}`).then((res) => res.data);
};
