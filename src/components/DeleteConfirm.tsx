import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// ─── Props ────────────────────────────────────────────────────────────────────
// T must have at least a `name` field so we can display what is being deleted.
// Any extra fields you pass in `meta` will show as detail rows.

export interface DeleteConfirmProps<T> {
  open: boolean;
  item: T | null;                            // the record to delete
  entityLabel?: string;                      // e.g. "Category", "Product", "User"
  description?: string;                      // override the default warning sentence
  meta?: { label: string; value: string }[]; // extra detail rows (id, status, etc.)
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeleteConfirm<T>({
  open,
  item,
  entityLabel = "Item",
  description,
  meta = [],
  loading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmProps<T>) {
  const displayName = item
    ? ((item as any).name || (item as any).referenceNo || (item as any).username || entityLabel)
    : entityLabel;

  const defaultDescription = (
    <>
      You are about to permanently delete{" "}
      <span className="font-semibold text-slate-700">
        &quot;{displayName}&quot;
      </span>
      . This action{" "}
      <span className="font-semibold text-rose-500">cannot be undone</span>.
    </>
  );

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-xl">

        {/* ── Danger Header ─────────────────────────────────────────────── */}
        <div className="bg-rose-50 border-b border-rose-100 px-6 pt-6 pb-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>

            <AlertDialogHeader className="p-0 space-y-1 text-left">
              <AlertDialogTitle className="text-base font-semibold text-slate-900 leading-snug">
                Delete {entityLabel}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description ?? defaultDescription}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        {/* ── Detail Card (only shown when meta rows are passed) ─────────── */}
        {meta.length > 0 && (
          <div className="px-6 py-4 bg-white">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-2">
              {meta.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <AlertDialogFooter className="px-6 pb-6 pt-2 flex flex-row gap-2 sm:justify-end">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={loading}
            className="flex-1 sm:flex-none h-9 rounded-xl border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 sm:flex-none h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold shadow-sm shadow-rose-200 transition-all disabled:opacity-70 focus-visible:ring-rose-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {entityLabel}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Detail Row (internal) ────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-slate-400 font-medium shrink-0">{label}</span>
      <span className="text-right font-medium text-slate-700 truncate max-w-[200px]">
        {value}
      </span>
    </div>
  );
}