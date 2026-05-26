import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { fetchStockById } from '@/services/stockService';
import type { Stock } from '@/types/Stock.type';

export default function StockDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchStockById(Number(id))
      .then((data) => setStock(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!stock) {
    return <div className="p-6">No stock data found.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Detail</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="font-medium">Product</div>
        <div>{stock.productName}</div>
        <div className="font-medium">Store</div>
        <div>{stock.storeName}</div>
        <div className="font-medium">Quantity</div>
        <div>
          {stock.quantity}{' '}
          {stock.quantity <= stock.alertQuantity && (
            <Badge variant="destructive" className="ml-2">
              Low Stock
            </Badge>
          )}
        </div>
        <div className="font-medium">Cost Price</div>
        <div>{stock.costPrice}</div>
        <div className="font-medium">Reorder Level</div>
        <div>{stock.reorderLevel}</div>
        <div className="font-medium">Alert Quantity</div>
        <div>{stock.alertQuantity}</div>
        <div className="font-medium">Last Restock</div>
        <div>{new Date(stock.lastRestockDate).toLocaleDateString()}</div>
      </div>
      <div className="mt-6">
        <Link to="/stocks" className="text-blue-600 hover:underline">
          ← Back to Stock List
        </Link>
      </div>
    </div>
  );
}
