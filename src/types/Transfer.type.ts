export interface ITransferItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ITransfer {
  id: number;
  transferNo: string;
  date: string;
  fromStoreId: number;
  toStoreId: number;
  note: string;
  total: number;
  grandTotal: number;
  status: string;
  attachment: string;
  createdBy: string;
  updatedBy: string;
  isActive: string;
  items: ITransferItem[];
}

export interface TransferFilter {
  page?: number;
  size?: number;
  status?: string;
}
