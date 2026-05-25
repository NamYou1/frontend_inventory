const STATUS_STYLES: Record<string, string> = {
  ACTIVE:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-slate-100  text-slate-500   border-slate-200",
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cls = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}