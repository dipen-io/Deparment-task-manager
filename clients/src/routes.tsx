import { LandingPage } from "./pages/LandingPage";
import { createBrowserRouter, Navigate } from "react-router";
import { NotFound } from "./pages/NotFoundPage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { Home } from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import { AllTasks } from "./components/FetchTaskByAdmin";
import { DashboardLayout } from "./components/DashboardLayout";
import { AdminDashboard } from "./components/AdminDashborad";
import { EmployeeDashbaord } from "./components/EmployeeDashboard";
import { SingleTask } from "./components/SingleTask";
import { EmployeeTask } from "./components/EmployeeTasks";
import { ProfilePage } from "./pages/ProfilePage";
import { DeptHeadDashboard } from "./components/DeptHeadDashboard";
import { RoleComponents } from "./components/RoleComponents";

export const router = createBrowserRouter([
  {
    path: "/",
    //  ProtectedRoute
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  // --- ADMIN ROUTES ---
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardLayout allowedProps={["admin"]} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "tasks", element: <AllTasks /> },
      { path: "task/:id", element: <SingleTask /> }, 
      { path: "role", element: <RoleComponents /> },
    ],
  },
  // {
  //   path: "/admin/task/:id",
  //   element: (
  //     <ProtectedRoute>
  //       <SingleTask />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/admin/role",
  //   element: (
  //     <ProtectedRoute>
  //       <RoleComponents />
  //     </ProtectedRoute>
  //   ),
  // },

  // --- DEPT_HEAD ROUTES ---
  {
    path: "/dept-head",
    element: (
      <ProtectedRoute>
        <DashboardLayout allowedProps={["head"]} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DeptHeadDashboard /> },
      { path: "tasks", element: <AllTasks /> },
    ],
  },

  {
    path: "/dept-head/task/:id",
    element: (
      <ProtectedRoute>
        <SingleTask />
      </ProtectedRoute>
    ),
  },
  // --- MEMBER ROUTES ---
  {
    path: "/member",
    element: (
      <ProtectedRoute>
        <DashboardLayout allowedProps={["member"]} />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <EmployeeDashbaord /> },
      { path: "tasks", element: <EmployeeTask /> },
    ],
  },

  {
    path: "/member/task/:id",
    element: (
      <ProtectedRoute>
        <SingleTask />
      </ProtectedRoute>
    ),
  },

  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",

    element: <LoginPage />,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
