export interface IAdjustment {
  id: number;
  referenceNo: string;
  productName: string;
  storeName: string;
  quantity: number;
  adjustmentType: string;
  status: string;
  reason: string;
  adjustmentDate: string;
  createdBy: string;
}

export interface AdjustmentFilter {
  page?: number;
  size?: number;
  status?: string;
}
