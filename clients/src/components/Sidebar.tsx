import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
    Home,
    CheckSquare,
    RollerCoaster,
    User,
    Menu,
    X,
    LogOut,
    Landmark,
    Info
} from "lucide-react";

interface SidebarProps {
    role: "Member" | "Admin" | "User" | "Head";
}

export function Sidebar({ role }: SidebarProps) {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const rolePaths = {
        Admin: "/admin",
        Member: "/member",
        User: "/member",
        Head: "/dept-head",
    };

    const basePath = rolePaths[role] || "/member";

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const navItems = [
        { icon: Home, label: "Home", path: `${basePath}/dashboard` },
        // { icon: CheckSquare, label: "My Tasks", path: `${basePath}/tasks` },
        {
            icon: CheckSquare,
            // Requirement: Rename label for Org Admin
            label: role === "Admin" ? "Tasks" : "My Tasks",
            path: `${basePath}/tasks`,
        },


        ...(role === "Admin"
            ? [
                {
                    label: "Department",
                    icon: Landmark, // Your admin icon component/asset
                    path: `${basePath}/department`,
                },
            ]
            : []),

        // if role is then i want to show role
        // Use a spread operator with a condition to inject the item only if Admin
        ...(role === "Admin"
            ? [
                {
                    label: "Role",
                    icon: RollerCoaster, // Your admin icon component/asset
                    path: `${basePath}/role`,
                },
            ]
            : []),

        // { icon: Users, label: "Team Requests", path: `${basePath}/requests` },
        { icon: User, label: "Profile", path: `/profile` },
        // { icon: Settings, label: "Settings", path: `${basePath}/settings` },
        { icon: LogOut, label: "Logout", action: handleLogout },
        { icon: Info, label: "Project Details", path: '/info' },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
                <h1 className="text-[#14b8a6]">TaskManager</h1>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/30 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200
          transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                <div className="p-6 border-b border-gray-200 hidden lg:block">
                    <h1 className="text-[#14b8a6]">TaskManager</h1>
                </div>

                <nav className="p-4 mt-16 lg:mt-0">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() =>
                                item.action
                                    ? item.action()
                                    : handleNavigation(item.path!)
                            }
                            className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
        ${item.action
                                    ? "text-red-500 hover:bg-red-50" // ✅ logout styled differently
                                    : location.pathname === item.path
                                        ? "bg-[#14b8a6]/10 text-[#14b8a6]"
                                        : "text-gray-600 hover:bg-gray-50"
                                }
      `}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}
