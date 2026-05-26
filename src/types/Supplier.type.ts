export interface ISupplier {
  id: number;
  name: string;
  email: string;
  address: string;
  status: string;
}

export interface SupplierForm {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}

export interface SupplierFilter {
  page?: number;
  size?: number;
  name?: string;
  status?: string;
}
