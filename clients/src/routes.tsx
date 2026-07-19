import { LandingPage } from "./pages/LandingPage";
import { createBrowserRouter, Navigate } from "react-router";
import { NotFound } from "./pages/NotFoundPage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { Home } from "./pages/Home";
import { Department } from "./pages/DepartmentPage";
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
import { TaskByHead } from "./components/FetchTaskByHead";
import { ProjectDetails } from "./pages/ProjectInfo";

import { RouteErrorPage } from "./pages/RouteErrorPage";
import ChatPage from "./pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    //  ProtectedRoute
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />
  },
  // --- ADMIN ROUTES ---
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardLayout allowedProps={["admin"]} />
      </ProtectedRoute>
    ),

    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "tasks", element: <AllTasks /> },
      { path: "task/:id", element: <SingleTask /> },
      { path: "role", element: <RoleComponents /> },
      { path: "department", element: <Department /> },
    ],
  },

  // --- DEPT_HEAD ROUTES ---
  {
    path: "/dept-head",
    element: (
      <ProtectedRoute>
        <DashboardLayout allowedProps={["head"]} />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DeptHeadDashboard /> },
      { path: "tasks", element: <TaskByHead /> },
      { path: "task/:id", element: <SingleTask /> },
      { path: "chat", element: <ChatPage /> }
    ],
  },

  // --- MEMBER ROUTES ---
  {
    path: "/member",
    element: (
      <ProtectedRoute>
        <DashboardLayout allowedProps={["member", "user"]} />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { path: "dashboard", element: <EmployeeDashbaord /> },
      { path: "tasks", element: <EmployeeTask /> },
      { path: "chat", element: <ChatPage /> }

    ],
  },

  {
    path: "/member/task/:id",
    element: (
      <ProtectedRoute>
        <SingleTask />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute >
        <ProfilePage />,
      </ProtectedRoute >)
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
    path: "/info",
    element: < ProjectDetails />
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
