import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchStocks } from '@/services/stockService';
import type { Stock } from '@/types/Stock.type';
import type { ApiResponse } from '@/utils/Pagination';
import { Spinner } from '@/components/ui/spinner';

const PAGE_SIZE = 10;

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadStocks = async (pageNumber: number) => {
    setLoading(true);
    try {
      const result: ApiResponse<Stock[]> = await fetchStocks({ page: pageNumber.toString(), size: PAGE_SIZE.toString() });
      setStocks(result.payload.data);
      setTotalPages(result.payload.content.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks(page);
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock List</h1>
      {loading ? (
        <Spinner />
      ) : (
        <Table>
          <TableCaption>A list of current stock items.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Last Restock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.productName}</TableCell>
                <TableCell>{stock.storeName}</TableCell>
                <TableCell>
                  {stock.quantity}
                  {stock.quantity <= stock.alertQuantity && (
                    <Badge variant="destructive" className="ml-2">Low Stock</Badge>
                  )}
                </TableCell>
                <TableCell>{stock.costPrice}</TableCell>
                <TableCell>{new Date(stock.lastRestockDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/stocks/${stock.id}`} className="text-blue-600 hover:underline">Details</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0 || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
          disabled={page + 1 >= totalPages || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
