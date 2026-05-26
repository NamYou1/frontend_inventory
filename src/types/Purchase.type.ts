export interface IPurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface IPurchase {
  id: number;
  reference: string;
  date: string;
  supplierId: number;
  supplierName: string;
  storeId: number;
  storeName: string;
  sellerId: number;
  sellerName: string;
  total: number;
  totalDiscount: number;
  grandTotal: number;
  purchasesStatus: string;
  items: IPurchaseItem[];
}

export interface PurchaseFilter {
  page?: number;
  size?: number;
  status?: string;
}
