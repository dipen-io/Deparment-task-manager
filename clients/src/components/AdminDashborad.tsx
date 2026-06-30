import { Sidebar } from "./Sidebar";
import { Users, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateTaskModal } from "./CreateTaskModal";
import { getTaskCount } from "../api/taskApi";
import { getUsers } from "../api/userApi";
import { TeamOverview } from "./TeamOverview";
import type { Employee } from "../api/userApi";
// import { useAuth } from "../context/AuthContext";

export function AdminDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskCount, setTaskCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [user, setUser] = useState<Employee[]>([]);

    // const { user } = useAuth();

    const stats = [
        {
            label: "Total Tasks",
            value: taskCount,
            change: "+12%",
            icon: ClipboardCheck,
            color: "text-[#14b8a6]",
        },
        {
            label: "Active Users",
            value: usersCount,
            change: "+5%",
            icon: Users,
            color: "text-blue-600",
        },
    ];

    useEffect(() => {
        const getTaskCounts = async () => {
            const count = await getTaskCount();
            setTaskCount(count.data);
        };
        const getUser = async () => {
            const res = await getUsers();
            setUsersCount(res?.data?.totalUsers);
            setUser(res?.data?.users);
        };
        getTaskCounts();
        getUser();
    }, []);


    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar role="Admin" />

            <main className="flex-1 pt-16 lg:pt-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-gray-900 mb-1">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage your team and monitor progress
                            </p>
                        </div>
                        {/*<div className="hidden sm:flex items-center gap-3">
              <button
                className="px-4 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#14b8a6]/90 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Create Task
              </button>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                AD
              </div>
            </div>*/}
                    </div>

                    {/* Render the Modal conditionally */}

                    {/*  */}
                    {isModalOpen && (
                        <CreateTaskModal
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                </header>

                {/* Content */}
                <div className="px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}
                                    >
                                        <stat.icon
                                            className={stat.color}
                                            size={24}
                                        />
                                    </div>
                                    <span className="text-sm text-green-600">
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-3xl text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*tearm overview*/}
                    <TeamOverview users={user} />
                </div>
            </main>
        </div>
    );
}
