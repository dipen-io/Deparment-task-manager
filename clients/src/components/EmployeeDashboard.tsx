import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function EmployeeDashbaord() {
    const navigate = useNavigate();
    const { user } = useAuth();
    if (user.role !== "dept_head") {
        console.log("route not found");
        navigate(-1);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar role="Member" />
            <h1 className="text-gray-900 mb-1">Member Dashboard</h1>

            <main className="flex-1 pt-16 lg:pt-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-gray-900 mb-1">
                                Welcome back, {user?.name}!
                            </h1>
                            <p className="text-gray-600">
                                Here's what's happening with your tasks today
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                                {user?.name.charAt(0).toUpperCase() +
                                    user?.name.charAt(1).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>
            </main>
        </div>
    );
}
