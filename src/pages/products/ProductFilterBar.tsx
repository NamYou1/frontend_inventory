import { SearchIcon, RotateCcw } from "lucide-react";
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

export function ProductFilterBar({
  search,
  status,
  categoryId,
  categories,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onReset,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search product name or code..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <Select value={categoryId} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Button */}
      <Button variant="outline" size="icon" onClick={onReset} title="Reset filters">
        <RotateCcw className="size-4" />
      </Button>
    </div>
  );
}
