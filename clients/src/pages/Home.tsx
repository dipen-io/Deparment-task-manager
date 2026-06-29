import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function Home() {
    const { user, loading } = useAuth();
    console.log("USER", user);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user?.userType === "admin") {
        toast.success(user.userType);
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.userType === "head") {
        toast.success(user.userType);
        return <Navigate to="/dept-head/dashboard" replace />;
    }
    return <Navigate to="/member/dashboard" replace />;
}
