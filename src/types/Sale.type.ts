export interface ISaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ISale {
  id: number;
  invoiceNo: string;
  saleDate: string;
  status: string;
  storeName: string;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  note: string;
  items: ISaleItem[];
}

export interface SaleFilter {
  page?: number;
  size?: number;
  status?: string;
}
