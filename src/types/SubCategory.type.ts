export interface ISubCategory {
  id: number;
  code: string;
  name: string;
  status: string;
  categoryId: number;
  categoryName: string;
}

export interface SubCategoryFilter {
  page?: number;
  size?: number;
  name?: string;
  code?: string;
  categoryId?: number;
  status?: string;
}

export interface SubCategoryForm {
  name?: string;
  code?: string;
  status: string;
  stauts?: string; // Backwards compatibility for typo
  categoryId: number;
}