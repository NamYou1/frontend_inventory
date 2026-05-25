import { useState } from "react";

export function usePagination(
  initialPage = 0,
  initialSize = 10
) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const nextPage = () =>
    setPage((p) => p + 1);

  const prevPage = () =>
    setPage((p) => Math.max(0, p - 1));

  const firstPage = () => setPage(0);

  const lastPage = (totalPages: number) =>
    setPage(Math.max(0, totalPages - 1));

  const changeSize = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const resetPage = () => setPage(0);

  return {
    page,
    size,
    setPage,
    setSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changeSize,
    resetPage,
  };
}