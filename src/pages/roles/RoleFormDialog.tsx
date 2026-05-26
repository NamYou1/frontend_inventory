import React, { useState, useEffect, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2Icon, ShieldCheckIcon } from "lucide-react";
import { usePermissions } from "@/hooks/usePermission";
import type { IRole, RoleForm } from "@/types/Role.type";
import type { IPermission } from "@/types/Permission.type";

interface RoleFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  role?: IRole | null;
  loading?: boolean;
  onSubmit: (data: RoleForm) => void;
  onClose: () => void;
}

export function RoleFormDialog({
  open,
  mode,
  role,
  loading = false,
  onSubmit,
  onClose,
}: RoleFormDialogProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  // Fetch all permissions list for assignment matrix
  const { data: permissionsData, isLoading: loadingPermissions } = usePermissions();
  const permissionsList = permissionsData?.payload || [];

  // Group permissions by their respective group name
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, IPermission[]> = {};
    permissionsList.forEach((perm) => {
      const gName = perm.groupName || "General Operations";
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(perm);
    });
    return groups;
  }, [permissionsList]);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && role) {
        setCode(role.code || "");
        setName(role.name || "");
        setDescription(role.description || "");
        setSelectedPermissionIds(role.permissionIds || []);
      } else {
        setCode("ROLE_");
        setName("");
        setDescription("");
        setSelectedPermissionIds([]);
      }
    }
  }, [open, mode, role]);

  const handlePermissionToggle = (id: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAllInGroup = (groupPerms: IPermission[], isSelected: boolean) => {
    const groupIds = groupPerms.map((p) => p.id);
    if (isSelected) {
      // Add all group permissions that are not yet selected
      setSelectedPermissionIds((prev) => [
        ...prev,
        ...groupIds.filter((id) => !prev.includes(id)),
      ]);
    } else {
      // Remove all group permissions
      setSelectedPermissionIds((prev) => prev.filter((id) => !groupIds.includes(id)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      permissionIds: selectedPermissionIds,
    });
  };

  const isFormValid = code.trim() && name.trim();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-primary" />
            {mode === "create" ? "Create Security Role" : "Edit Security Role"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Establish a new access role and configure permission sets."
              : "Refine access scopes and adjust mapped system capabilities."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {/* Primary details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-code">Role Code *</Label>
              <Input
                id="role-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ROLE_MANAGER"
                required
                disabled={loading || mode === "edit"}
                className="font-mono text-xs tracking-wider"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-name">Display Name *</Label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Regional Manager"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role-desc">Description</Label>
            <Input
              id="role-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of duties..."
              disabled={loading}
            />
          </div>

          {/* Mapped Permissions checklist */}
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <Label className="font-semibold text-slate-700 text-sm">
                Access Capability Map
              </Label>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                {selectedPermissionIds.length} selected
              </span>
            </div>

            {loadingPermissions ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                <Loader2Icon className="h-4 w-4 animate-spin text-primary" /> Loading permissions matrix...
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {Object.entries(groupedPermissions).map(([groupName, perms]) => {
                  const allSelectedInGroup = perms.every((p) =>
                    selectedPermissionIds.includes(p.id)
                  );

                  return (
                    <div
                      key={groupName}
                      className="rounded-md border border-slate-200 bg-white p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                          {groupName} Management
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Checkbox
                            id={`grp-sel-${groupName}`}
                            checked={allSelectedInGroup}
                            onCheckedChange={(checked) =>
                              handleSelectAllInGroup(perms, !!checked)
                            }
                            disabled={loading}
                            className="h-3 w-3"
                          />
                          <Label
                            htmlFor={`grp-sel-${groupName}`}
                            className="text-[10px] text-muted-foreground cursor-pointer select-none font-medium"
                          >
                            Toggle Group
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1.5">
                        {perms.map((p) => (
                          <div key={p.id} className="flex items-start gap-2">
                            <Checkbox
                              id={`perm-${p.id}`}
                              checked={selectedPermissionIds.includes(p.id)}
                              onCheckedChange={() => handlePermissionToggle(p.id)}
                              disabled={loading}
                            />
                            <Label
                              htmlFor={`perm-${p.id}`}
                              className="text-[11px] leading-none cursor-pointer select-none"
                            >
                              <span className="font-semibold block text-slate-700">{p.name}</span>
                              <span className="font-mono text-[9px] text-muted-foreground">
                                {p.code}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {mode === "create" ? "Create Role" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
