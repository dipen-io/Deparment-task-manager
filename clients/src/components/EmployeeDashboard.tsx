import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function EmployeeDashbaord() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fix: Using an inclusion array handles multi-role gating cleanly without redirect loops
    const allowedRoles = ["member", "user"];
    if (user && !allowedRoles.includes(user?.userType)) {
        console.log("Route unauthorized for this user role");
        navigate(-1);
        return null;
    }

    // Fallback display if user object hasn't loaded yet
    if (!user) return null;

    // Generate neat initials from the name safely
    const initials = user.name
        ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
        : "US";

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Main view track */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">

                {/* Header Card */}
                <header className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-6 transition-all">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 mb-2 capitalize">
                                {user.userType === "member" ? "Member Portal" : "User Portal"}
                            </span>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                                Welcome back, {user.name}!
                            </h1>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Here's what's happening with your tasks today
                            </p>
                        </div>

                        {/* Interactive Profile Action Avatar */}
                        <button
                            onClick={() => navigate("/profile")}
                            aria-label="View Profile"
                            className="group relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full transition-all duration-200"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                                {initials}
                            </div>
                            {/* Hover tooltip hint */}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-10 pointer-events-none">
                                View Profile
                            </span>
                        </button>
                    </div>
                </header>

                {/* Dashboard body grid layout placeholder */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Task tracking layout modules can go here */}
                </div>
            </main>
        </div>
    );
}