import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUser } from "@/utils/auth";

export const GuestRoute = () => {
  const authenticated = isAuthenticated();
  const user = getUser();

  if (authenticated && user) {
    // If Admin, redirect to /store, else redirect to dashboard /
    if (user.roles.includes("ROLE_ADMIN")) {
      return <Navigate to="/store" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
