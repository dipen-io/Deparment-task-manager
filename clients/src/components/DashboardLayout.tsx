import { Outlet, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  allowedProps: Array<"admin" | "head" | "user" | "member">;
}

export function DashboardLayout({ allowedProps }: DashboardLayoutProps) {

  const { user, loading } = useAuth();

  // If no user is logged in, send them to login
  if (loading) return <div> loaidng.. </div>
  // if (!user) return <Navigate to="/login" replace />;
  if (!user) return null;

  const hasPermission = allowedProps?.includes(user.userType as any);
  if (!hasPermission) {
   console.warn(`User type "${user.userType}" unauthorized for this layout. Re-routing.`);
    // return <Navigate to="/login" replace />
   return <Navigate to="/" replace />; // home will send them to correct route
  }

  const sidebarRole = 
      user.userType === "admin" ? "Admin" : 
      user.userType === "head" ? "Head" :
      user.userType === "member" ? "Member" : "User"

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar gets the role to generate the correct links */}
      <Sidebar role={sidebarRole} />
      {/* The main content area */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="p-6">
          {/* Outlet is where the Dashboard, Tasks, etc., will be injected based on the URL */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
