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
import { Loader2Icon } from "lucide-react";
import type { IUnit, UnitForm } from "@/types/Unit.type";

interface UnitFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  unit?: IUnit | null;
  units: IUnit[];
  loading?: boolean;
  onSubmit: (data: UnitForm) => void;
  onClose: () => void;
}

export function UnitFormDialog({
  open,
  mode,
  unit,
  units,
  loading = false,
  onSubmit,
  onClose,
}: UnitFormDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [baseUnit, setBaseUnit] = useState<string>("NONE");
  const [operation, setOperation] = useState<string>("NONE");
  const [operationValue, setOperationValue] = useState<number | "">("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && unit) {
        setName(unit.name || "");
        setCode(unit.code || "");
        setBaseUnit(unit.baseUnit ? String(unit.baseUnit) : "NONE");
        setOperation(unit.operation || "NONE");
        setOperationValue(unit.operationValue !== undefined && unit.operationValue !== null ? Number(unit.operationValue) : "");
        setStatus(unit.status || "ACTIVE");
      } else {
        setName("");
        setCode("");
        setBaseUnit("NONE");
        setOperation("NONE");
        setOperationValue("");
        setStatus("ACTIVE");
      }
    }
  }, [open, mode, unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const formData: UnitForm = {
      name: name.trim(),
      code: code.trim(),
      baseUnit: baseUnit === "NONE" ? undefined : Number(baseUnit),
      operation: operation === "NONE" ? undefined : operation,
      operationValue: operation === "NONE" || operationValue === "" ? undefined : Number(operationValue),
      status,
    };

    onSubmit(formData);
  };

  // Filter out the current unit from base unit options to prevent circular dependency
  const baseUnitOptions = units.filter((u) => !unit || u.id !== unit.id);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Unit" : "Edit Unit"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new measurement unit to your catalog."
              : "Update your unit configuration details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Code and Name Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="unit-code">Code</Label>
              <Input
                id="unit-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PCS, KG"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="unit-name">Name</Label>
              <Input
                id="unit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pieces, Kilograms"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Base Unit Selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="unit-base">Base Unit (Optional)</Label>
            <Select value={baseUnit} onValueChange={setBaseUnit} disabled={loading}>
              <SelectTrigger id="unit-base" className="w-full">
                <SelectValue placeholder="Select base unit (if sub-unit)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">No Base Unit (This is a base unit)</SelectItem>
                {baseUnitOptions.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name} ({u.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conversion Details (Only visible/enabled if baseUnit is selected) */}
          {baseUnit !== "NONE" && (
            <div className="grid grid-cols-2 gap-4 border border-primary/20 bg-primary/5 p-3 rounded-lg">
              <div className="flex flex-col gap-2">
                <Label htmlFor="unit-op">Operation</Label>
                <Select value={operation} onValueChange={setOperation} disabled={loading}>
                  <SelectTrigger id="unit-op" className="w-full">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    <SelectItem value="MULTIPLY">Multiply (*)</SelectItem>
                    <SelectItem value="DIVIDE">Divide (/)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="unit-op-val">Conversion Value</Label>
                <Input
                  id="unit-op-val"
                  type="number"
                  step="any"
                  value={operationValue}
                  onChange={(e) => setOperationValue(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 1000, 12"
                  disabled={loading || operation === "NONE"}
                  required={operation !== "NONE"}
                />
              </div>
            </div>
          )}

          {/* Status Selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="unit-status">Status</Label>
            <Select value={status} onValueChange={setStatus} disabled={loading}>
              <SelectTrigger id="unit-status" className="w-full">
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
            <Button type="submit" disabled={loading || !name.trim() || !code.trim()}>
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
