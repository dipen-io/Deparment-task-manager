import { Outlet, Navigate } from "react-router";
// import { Sidebar } from './Sidebar';

export function DashboardLayout({ user }) {
  // If no user is logged in, send them to login
  if (!user) return <Navigate to="/login" replace />;

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
