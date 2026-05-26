import { useMemo } from "react";
import { ShieldAlertIcon, Loader2Icon } from "lucide-react";

// Hooks
import { usePermissions } from "@/hooks/usePermission";

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PermissionPage() {
  const { data, isLoading } = usePermissions();
  const permissions = useMemo(() => data?.payload || [], [data]);

  // Group permissions by their group name
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, typeof permissions> = {};
    permissions.forEach((perm) => {
      const gName = perm.groupName || "General Systems";
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(perm);
    });
    return groups;
  }, [permissions]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* Heading Header Module */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">System Capabilities & Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Review all granular action privileges and security handles registered on the Spring Boot backend
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="h-5 w-5 animate-spin text-primary" />
          Loading permissions directory...
        </div>
      ) : permissions.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
          <ShieldAlertIcon className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold">No Permissions Found</p>
          <p className="text-xs max-w-xs text-slate-500">
            Please run backend seeds to register security rules and operations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedPermissions).map(([groupName, perms]) => (
            <Card key={groupName} className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  {groupName} operations
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {perms.length} distinct permission handle{perms.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-3">
                  {perms.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col gap-1 rounded-md border border-slate-200 bg-slate-50/50 p-2.5 hover:border-slate-300 duration-150"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-700">{p.name}</span>
                        <Badge
                          variant="outline"
                          className="font-mono text-[9px] font-medium tracking-wide bg-primary/5 text-primary border-primary/20 shrink-0"
                        >
                          {p.code}
                        </Badge>
                      </div>
                      {p.description && (
                        <p className="text-[10px] text-slate-500 leading-normal">
                          {p.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
