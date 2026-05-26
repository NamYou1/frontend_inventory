const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    "bg-emerald-100/80 text-emerald-800 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40",
  INACTIVE:  "bg-rose-100/80 text-rose-800 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40",
  PENDING:   "bg-amber-100/80 text-amber-800 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40",
  APPROVED:  "bg-sky-100/80 text-sky-800 border-sky-200/50 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/40",
  COMPLETED: "bg-emerald-100/80 text-emerald-800 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40",
  CANCELLED: "bg-rose-100/80 text-rose-800 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40",
  REJECTED:  "bg-red-100/80 text-red-800 border-red-200/50 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/40",
  RETURNED:  "bg-indigo-100/80 text-indigo-800 border-indigo-200/50 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800/40",
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();
  const cls = STATUS_STYLES[normalized] ?? "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 shadow-sm ${cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {normalized}
    </span>
  );
}