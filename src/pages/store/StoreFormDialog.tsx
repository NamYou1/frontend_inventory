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
import type { IStore, StoreForm } from "@/types/Store.type";

interface StoreFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  store?: IStore | null;
  loading?: boolean;
  onSubmit: (data: StoreForm) => void;
  onClose: () => void;
}

export function StoreFormDialog({
  open,
  mode,
  store,
  loading = false,
  onSubmit,
  onClose,
}: StoreFormDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressOne, setAddressOne] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && store) {
        setName(store.name || "");
        setCode(store.code || "");
        setEmail(store.email || "");
        setPhone(store.phone || "");
        setAddressOne(store.addressOne || "");
        setCity(store.city || "");
        setState(store.state || "");
        setPostalCode(store.postalCode || "");
        setCountry(store.country || "");
        setStatus(store.status || "ACTIVE");
      } else {
        setName("");
        setCode("");
        setEmail("");
        setPhone("");
        setAddressOne("");
        setCity("");
        setState("");
        setPostalCode("");
        setCountry("");
        setStatus("ACTIVE");
      }
    }
  }, [open, mode, store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !email.trim() || !phone.trim()) return;
    
    onSubmit({
      name: name.trim(),
      code: code.trim(),
      email: email.trim(),
      phone: phone.trim(),
      addressOne: addressOne.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      status,
    });
  };

  const isFormValid = name.trim() && code.trim() && email.trim() && phone.trim();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "create" ? "Create Store" : "Edit Store"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Register a new retail store outlet."
              : "Update current store credentials and location details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Primary credentials group */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-name">Store Name *</Label>
              <Input
                id="store-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Downtown Outlet"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-code">Store Code *</Label>
              <Input
                id="store-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ST-DWTN"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-email">Email *</Label>
              <Input
                id="store-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="store@domain.com"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-phone">Phone *</Label>
              <Input
                id="store-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Location Details group */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="store-address">Street Address</Label>
            <Input
              id="store-address"
              value={addressOne}
              onChange={(e) => setAddressOne(e.target.value)}
              placeholder="e.g. 123 Main Street"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-city">City</Label>
              <Input
                id="store-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-state">State / Region</Label>
              <Input
                id="store-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-zip">Postal Code</Label>
              <Input
                id="store-zip"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="10001"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-country">Country</Label>
              <Input
                id="store-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-status">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={loading}>
                <SelectTrigger id="store-status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {mode === "create" ? "Create Store" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
