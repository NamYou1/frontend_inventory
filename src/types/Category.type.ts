export interface ICategory {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface CategoryForm {
  name: string;
  description: string;
  status: string;
}

export interface CategoryFilter {
  page?: number;
  size?: number;
  name?: string;
  status?: string;
}