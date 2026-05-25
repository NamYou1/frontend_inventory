// components/common/PaginationControls.tsx

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const PAGE_SIZES = [5, 10, 20, 50];

type Props = {
  pagination: any;
  page: number;
  size: number;

  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  onLast: () => void;

  onSizeChange: (size: number) => void;
};

export function PaginationControls({
  pagination,
  page,
  size,
  onNext,
  onPrev,
  onFirst,
  onLast,
  onSizeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {page * size + 1}–
        {page * size + pagination.numberOfElements} of{" "}
        {pagination.totalElements}
      </p>

      <div className="flex items-center gap-4">
        <Select
          value={String(size)}
          onValueChange={(v) => onSizeChange(Number(v))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {PAGE_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm">
          Page {pagination.number + 1} of{" "}
          {pagination.totalPages}
        </span>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            disabled={pagination.first}
            onClick={onFirst}
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            disabled={pagination.first}
            onClick={onPrev}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            disabled={pagination.last}
            onClick={onNext}
          >
            <ChevronRightIcon className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            disabled={pagination.last}
            onClick={onLast}
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}