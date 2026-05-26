import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ICategory } from "@/types/Category.type";

type Props = {
  search: string;
  status: string;
  categoryId: string;
  categories: ICategory[];
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onReset: () => void;
};

export function SubCategoryFilterBar({
  search,
  status,
  categoryId,
  categories,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onReset,
}: Props) {
  const isFiltered = search || status !== "ALL" || categoryId !== "ALL";

  return (
    <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
      <div className="flex flex-wrap items-center gap-3">
        {/* Term Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            className="pl-9 bg-white dark:bg-slate-950"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[200px] bg-white dark:bg-slate-950">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] bg-white dark:bg-slate-950">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-9 px-3 gap-1.5 hover:bg-slate-100 text-slate-500  hover:text-slate-900"
          >
            <XIcon className="size-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
