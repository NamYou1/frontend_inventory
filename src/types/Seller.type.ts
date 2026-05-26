export interface ISeller {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export interface SellerForm {
  name: string;
  email: string;
  phone: string;
  status?: string;
}

export interface SellerFilter {
  page?: number;
  size?: number;
  name?: string;
  status?: string;
}
