export interface Stock {
  id: number;
  quantity: number;
  costPrice: number;
  reorderLevel: number;
  alertQuantity: number;
  lastRestockDate: string; // ISO string
  productName: string;
  storeName: string;
}
