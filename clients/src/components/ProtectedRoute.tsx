import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!user) {
    console.log("No user found, kicking to landing");
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default ProtectedRoute;
