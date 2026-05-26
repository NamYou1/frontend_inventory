export interface IProduct {
  id: number;
  code: string;
  name: string;
  otherName: string;
  salePrice: number;
  costPrice: number;
  taxMethod: number;
  barCodeSymbology: string;
  type: string;
  details: string;
  alertQuantity: number;
  unitId: number;
  unitName: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  imageUrl: string;
  status: string;
}

export interface ProductForm {
  code: string;
  name: string;
  otherName?: string;
  salePrice: number;
  costPrice: number;
  taxMethod?: number;
  barCodeSymbology?: string;
  type?: string;
  details?: string;
  alertQuantity?: number;
  unitId: number;
  categoryId: number;
  subCategoryId: number;
  imageUrl?: string;
  status?: string;
}

export interface ProductFilter {
  page?: number;
  size?: number;
  name?: string;
  status?: string;
  categoryId?: number;
}
