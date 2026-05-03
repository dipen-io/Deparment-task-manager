import { useEffect, useState } from 'react';
import { getTaskByEmp, updateTaskStatusByEmp } from '../api/taskApi';
import { CheckSquare, Clock, AlertCircle, ChevronDown } from 'lucide-react';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdBy: { name: string; email: string };
    createdAt: string;
}

const statusConfig = {
    'pending': { label: 'Pending', icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    'in-progress': { label: 'In Progress', icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'completed': { label: 'Completed', icon: CheckSquare, color: 'text-green-600 bg-green-50 border-green-200' },
};

export function EmployeeTask() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                const data = await getTaskByEmp();
                // console.log(data.data);
                setTasks(data.data.data);
            } catch (err: any) {
                setError(err?.message || 'Failed to fetch tasks');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    if (isLoading) return <p>Loading...</p>;

    if (error) return (
        <div className="text-center py-10 text-red-500">
            <p>{error}</p>
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Tasks</h1>

            {/* ✅ single empty state check, inside return */}
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-[#14b8a6]/10 rounded-full flex items-center justify-center mb-4">
                        <CheckSquare size={36} className="text-[#14b8a6]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">You're all caught up!</h2>
                    <p className="text-gray-400 text-sm max-w-xs">
                        No tasks have been assigned to you yet. Check back later or contact your manager.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map((task) => {
                        const { label, icon: Icon, color } = statusConfig[task.status];
                        return (
                            <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-gray-900 font-medium mb-1">{task.title}</h2>
                                        <p className="text-gray-500 text-sm">{task.description}</p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === task._id ? null : task._id)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${color}`}
                                        >
                                            <Icon size={12} />
                                            {label}
                                            <ChevronDown size={12} />
                                        </button>

                                        {/* Dropdown */}
                                        {openDropdown === task._id && (
                                            <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-36">
                                                {Object.entries(statusConfig).map(([key, { label, icon: OptionIcon, color }]) => (
                                                    <button
                                                        key={key}
                                                        onClick={async () => {
                                                            await updateTaskStatusByEmp(task._id, key);
                                                            setTasks(prev =>
                                                                prev.map(t => t._id === task._id ? { ...t, status: key as Task['status'] } : t)
                                                            );
                                                            setOpenDropdown(null);
                                                        }}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 ${color}`}
                                                    >
                                                        <OptionIcon size={12} />
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
                                    <span>Created by <span className="font-medium text-gray-600">{task.createdBy?.name}</span></span>

                                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}