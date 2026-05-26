import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
};

export function UserFilterBar({ search, onSearchChange }: Props) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by username or email..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
