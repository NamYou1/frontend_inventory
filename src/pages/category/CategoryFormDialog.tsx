// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2Icon } from "lucide-react";
// import type { ICategory, CategoryForm } from "@/types/Category.type";

// interface CategoryFormDialogProps {
//   open: boolean;
//   mode: "create" | "edit";
//   category?: ICategory | null;
//   loading?: boolean;
//   onSubmit: (data: CategoryForm) => void;
//   onClose: () => void;
// }

// export function CategoryFormDialog({
//   open,
//   mode,
//   category,
//   loading = false,
//   onSubmit,
//   onClose,
// }: CategoryFormDialogProps) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState("ACTIVE");

//   // Populate / reset form when the dialog opens
//   useEffect(() => {
//     if (!open) return;
//     if (mode === "edit" && category) {
//       setName(category.name);
//       setDescription(category.description);
//       setStatus(category.status);
//     } else {
//       setName("");
//       setDescription("");
//       setStatus("ACTIVE");
//     }
//   }, [open, mode, category]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({ name, description, status });
//   };

//   return (
//     <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
//       <DialogContent className="sm:max-w-[460px]">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "create" ? "Create Category" : "Edit Category"}
//           </DialogTitle>
//           <DialogDescription>
//             {mode === "create"
//               ? "Add a new category to your collection."
//               : "Update the category details below."}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
//           {/* Name */}
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="cat-name">Name</Label>
//             <Input
//               id="cat-name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g. Electronics"
//               required
//               autoFocus
//             />
//           </div>

//           {/* Description */}
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="cat-desc">Description</Label>
//             <Input
//               id="cat-desc"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Short description…"
//             />
//           </div>

//           {/* Status */}
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="cat-status">Status</Label>
//             <Select value={status} onValueChange={setStatus}>
//               <SelectTrigger id="cat-status" className="w-full">
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ACTIVE">Active</SelectItem>
//                 <SelectItem value="INACTIVE">Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <DialogFooter className="gap-2 pt-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading || !name.trim()}>
//               {loading && (
//                 <Loader2Icon className="mr-2 size-4 animate-spin" />
//               )}
//               {mode === "create" ? "Create" : "Save Changes"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
// pages/category/CategoryFormDialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";
import type { ICategory, CategoryForm } from "@/types/Category.type";

interface CategoryFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  category?: ICategory | null;
  loading?: boolean;
  onSubmit: (data: CategoryForm) => void;
  onClose: () => void;
}

export function CategoryFormDialog({
  open,
  mode,
  category,
  loading = false,
  onSubmit,
  onClose,
}: CategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  // Sync incoming database context or clear state on state changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && category) {
        setName(category.name);
        setDescription(category.description ?? "");
        setStatus(category.status);
      } else {
        setName("");
        setDescription("");
        setStatus("ACTIVE");
      }
    }
  }, [open, mode, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ 
      name: name.trim(), 
      description: description.trim(), 
      status 
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new category to your collection."
              : "Update the category details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electronics"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short description..."
              className="resize-none"
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-status">Status</Label>
            <Select 
              value={status} 
              onValueChange={setStatus}
              disabled={loading}
            >
              <SelectTrigger id="cat-status" className="w-full">
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
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading && (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              )}
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}