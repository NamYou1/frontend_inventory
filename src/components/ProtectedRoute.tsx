import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, getUser } from "@/utils/auth";
import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const user = getUser();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get roles safely
  const userRoles = user?.roles || [];

  // Auto-redirect store admin to the /store page if they hit the default home path /
  if (userRoles.includes("ROLE_ADMIN") && !userRoles.includes("ROLE_SUPER_ADMIN") && location.pathname === "/") {
    return <Navigate to="/store" replace />;
  }

  // If there are allowed roles, check if the user has at least one of them
  if (allowedRoles) {
    const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
      // If the user has ROLE_ADMIN, automatically redirect them to their allowed page (/store)
      if (userRoles.includes("ROLE_ADMIN") && allowedRoles.includes("ROLE_SUPER_ADMIN")) {
        return <Navigate to="/store" replace />;
      }

      return (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlertIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="max-w-md text-muted-foreground text-sm">
            Your account ({user?.username}) does not have permission to view this page. This area is reserved for {allowedRoles.join(", ")}.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => (window.location.href = "/")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
};
