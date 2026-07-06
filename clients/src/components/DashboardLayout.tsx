import { Outlet, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { replace } from "react-router";
// import type { ReactNode } from "react";
// import type { User } from "./types/userType";
// import { Sidebar } from './Sidebar';

// interface DashboardLayoutProps {
//   user: "Admin" | "Head" | "Member";
//   childre?: ReactNode;
// }

interface DashboardLayoutProps {
    allowedProps: Array<"admin" | "Head" | "Member">;
}


export function DashboardLayout({ allowedProps }: DashboardLayoutProps) {

    const { user, loading } = useAuth();
    console.log("user DashboardLayoutProps" , allowedProps)
    console.log(user?.userType);
  // If no user is logged in, send them to login
  if (loading) return <div> loaidng.. </div>
  if (!user) return <Navigate to="/login" replace />;

  const hasPermission = allowedProps?.includes(user.userType as any);
  if (!hasPermission) {
      return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar gets the role to generate the correct links */}
      {/* <Sidebar role={user.role} /> */}

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
