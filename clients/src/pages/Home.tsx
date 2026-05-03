import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user?.role === "org_admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === "dept_head") {
    return <Navigate to="/dept-head/dashboard" replace />;
  }
  console.log("skipped");
  return <Navigate to="/member/dashboard" replace />;
}
