import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, ShieldIcon } from "lucide-react";
import { useRoles } from "@/hooks/useRole";
import { useStores } from "@/hooks/useStore";
import type { IUser, UserForm } from "@/types/User.type";
import { getUser } from "@/utils/auth";

interface UserFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  user?: IUser | null;
  loading?: boolean;
  onSubmit: (data: UserForm) => void;
  onClose: () => void;
}

export function UserFormDialog({
  open,
  mode,
  user,
  loading = false,
  onSubmit,
  onClose,
}: UserFormDialogProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [storeId, setStoreId] = useState<string>("NONE");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const currentUser = getUser();
  const isSuperAdmin = currentUser?.roles.includes("ROLE_SUPER_ADMIN");
  const isStoreAdmin = currentUser?.roles.includes("ROLE_ADMIN") && !isSuperAdmin;
  const currentUserStoreId = currentUser?.storeId;

  // Fetch roles and stores for dropdown options
  const { data: rolesData, isLoading: loadingRoles } = useRoles();
  const { data: storesData, isLoading: loadingStores } = useStores({ size: 100 }); // Large size to fetch all stores
  
  const rolesList = useMemo(() => {
    const rawRoles = rolesData?.payload || [];
    if (isStoreAdmin) {
      return rawRoles.filter(r => r.code !== "ROLE_SUPER_ADMIN" && r.code !== "ROLE_ADMIN");
    }
    return rawRoles;
  }, [rolesData, isStoreAdmin]);

  const storesList = useMemo(() => {
    const rawStores = storesData?.payload?.data || [];
    if (isStoreAdmin && currentUserStoreId) {
      return rawStores.filter(st => st.id === currentUserStoreId);
    }
    return rawStores;
  }, [storesData, isStoreAdmin, currentUserStoreId]);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && user) {
        setUsername(user.username || "");
        setEmail(user.email || "");
        setPassword(""); // Blank on edit
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhone(user.phone || "");
        setIsActive(user.isActive !== false);
        setStoreId(user.storeId ? String(user.storeId) : "NONE");
        setSelectedRoles(user.roles || []);
      } else {
        setUsername("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setIsActive(true);
        setStoreId(isStoreAdmin && currentUserStoreId ? String(currentUserStoreId) : "NONE");
        setSelectedRoles(isStoreAdmin ? ["ROLE_STAFF"] : []);
      }
    }
  }, [open, mode, user, isStoreAdmin, currentUserStoreId]);

  const handleRoleToggle = (roleCode: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleCode)
        ? prev.filter((r) => r !== roleCode)
        : [...prev, roleCode]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || (mode === "create" && !password.trim())) return;

    onSubmit({
      username: username.trim(),
      email: email.trim(),
      ...(password && { password }),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      isActive,
      storeId: storeId === "NONE" ? null : Number(storeId),
      roleCodes: selectedRoles,
    });
  };

  const isFormValid =
    username.trim() &&
    email.trim() &&
    (mode === "edit" || password.trim()) &&
    selectedRoles.length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "create" ? "Create User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Register a new user account and map security roles."
              : "Update account settings, store assignments, and active permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usr-username">Username *</Label>
              <Input
                id="usr-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
                required
                disabled={loading || mode === "edit"}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usr-email">Email *</Label>
              <Input
                id="usr-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usr-first">First Name</Label>
              <Input
                id="usr-first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usr-last">Last Name</Label>
              <Input
                id="usr-last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usr-phone">Phone Number</Label>
              <Input
                id="usr-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usr-pass">
                Password {mode === "create" ? "*" : "(Leave empty to keep current)"}
              </Label>
              <Input
                id="usr-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required={mode === "create"}
                disabled={loading}
              />
            </div>
          </div>

          {/* Assignments (Store Selection) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="usr-store">Assigned Store</Label>
              <Select value={storeId} onValueChange={setStoreId} disabled={loading || loadingStores || isStoreAdmin}>
                <SelectTrigger id="usr-store" className="w-full">
                  <SelectValue placeholder="Select Store" />
                </SelectTrigger>
                <SelectContent>
                  {!isStoreAdmin && <SelectItem value="NONE">Global / No Store (Super Admin)</SelectItem>}
                  {storesList.map((st) => (
                    <SelectItem key={st.id} value={String(st.id)}>
                      {st.name} ({st.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="usr-active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
                disabled={loading}
              />
              <Label htmlFor="usr-active" className="cursor-pointer select-none">
                Account Active & Enabled
              </Label>
            </div>
          </div>

          {/* Role Checkboxes */}
          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <Label className="flex items-center gap-1.5 font-semibold text-slate-700">
              <ShieldIcon className="h-4 w-4 text-primary" />
              Security Roles * (Select at least one)
            </Label>
            {loadingRoles ? (
              <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                <Loader2Icon className="h-3 w-3 animate-spin" /> Loading roles list...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {rolesList.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`role-${role.code}`}
                      checked={selectedRoles.includes(role.code)}
                      onCheckedChange={() => handleRoleToggle(role.code)}
                      disabled={loading}
                    />
                    <Label
                      htmlFor={`role-${role.code}`}
                      className="text-xs cursor-pointer select-none"
                    >
                      {role.name}
                      <span className="block text-[10px] text-muted-foreground font-mono">
                        {role.code}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-slate-100">
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
              {mode === "create" ? "Create Account" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
