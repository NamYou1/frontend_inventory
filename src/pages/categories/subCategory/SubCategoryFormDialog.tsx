import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, AlertCircleIcon } from "lucide-react";
import type { ISubCategory, SubCategoryForm } from "@/types/SubCategory.type";
import type { ICategory } from "@/types/Category.type";

interface SubCategoryFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  subCategory?: ISubCategory | null;
  categories: ICategory[];
  loading?: boolean;
  onSubmit: (data: SubCategoryForm) => void;
  onClose: () => void;
}

export function SubCategoryFormDialog({
  open,
  mode,
  subCategory,
  categories,
  loading = false,
  onSubmit,
  onClose,
}: SubCategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState("ACTIVE");

  // Sync state when dialog opens or changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && subCategory) {
        setName(subCategory.name);
        setCode(subCategory.code);
        setCategoryId(String(subCategory.categoryId));
        setStatus(subCategory.status);
      } else {
        setName("");
        setCode("");
        // Select first active category as default if available
        const activeCategories = categories.filter(c => c.status === "ACTIVE");
        setCategoryId(activeCategories[0]?.id ? String(activeCategories[0].id) : "");
        setStatus("ACTIVE");
      }
    }
  }, [open, mode, subCategory, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !categoryId) return;
    
    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      categoryId: Number(categoryId),
      status,
      stauts: status, // Duplicate for typo safety
    });
  };

  // Only allow active categories to be chosen during creation, but also allow current category if editing
  const filteredCategories = categories.filter(
    (cat) => cat.status === "ACTIVE" || (mode === "edit" && cat.id === subCategory?.categoryId)
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Subcategory" : "Edit Subcategory"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new subcategory with a valid parent category."
              : "Update your subcategory settings below."}
          </DialogDescription>
        </DialogHeader>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-100 dark:border-amber-900/50">
            <AlertCircleIcon className="size-8" />
            <div>
              <p className="font-semibold text-sm">No categories available</p>
              <p className="text-xs opacity-90 mt-1">
                You must create at least one active Category before adding a Subcategory.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="mt-2">
              Go Back
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
            {/* Parent Category Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="subcat-parent">Parent Category</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={loading}
              >
                <SelectTrigger id="subcat-parent" className="w-full bg-white dark:bg-slate-950">
                  <SelectValue placeholder="Select a parent category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name} {cat.status === "INACTIVE" && "(Inactive)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="subcat-name">Subcategory Name</Label>
              <Input
                id="subcat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smart Phones, Laptops"
                required
                disabled={loading}
              />
            </div>

            {/* Code Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="subcat-code">Subcategory Code</Label>
              <Input
                id="subcat-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, "-"))}
                placeholder="e.g. SMART-PHONES"
                required
                disabled={loading}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Codes are automatically converted to uppercase and hyphenated.
              </p>
            </div>

            {/* Status Selection */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="subcat-status">Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={loading}
              >
                <SelectTrigger id="subcat-status" className="w-full bg-white dark:bg-slate-950">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dialog Action Footers */}
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !name.trim() || !code.trim() || !categoryId}>
                {loading && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                {mode === "create" ? "Create" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
