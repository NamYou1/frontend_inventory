export interface IStore {
  id: number;
  name: string;
  code: string;
  logo?: string;
  email: string;
  phone: string;
  addressOne?: string;
  addressTwo?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  status: string;
}

export interface StoreForm {
  name: string;
  code: string;
  logo?: string;
  email: string;
  phone: string;
  addressOne?: string;
  addressTwo?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  status: string;
}

export interface StoreFilter {
  page?: number;
  size?: number;
  name?: string;
  code?: string;
  status?: string;
}
