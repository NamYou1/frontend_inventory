// features/categories/CategoryFilterBar.tsx

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;
  status: string;

  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
};

export function CategoryFilterBar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />

        <Input
          placeholder="Search..."
          className="pl-9"
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />
      </div>

      <Select
        value={status}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            All
          </SelectItem>

          <SelectItem value="ACTIVE">
            Active
          </SelectItem>

          <SelectItem value="INACTIVE">
            Inactive
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}