import { useEffect, useState, useRef } from 'react';
import { getTaskByEmp, updateTaskStatusByEmp } from '../api/taskApi';
import { CheckSquare, Clock, AlertCircle, ChevronDown, User, Calendar, ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';

interface Task {
    task: any;
    _id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in-progress' | 'completed';
    createdBy: { name: string; email: string };
    createdAt: string;
}

const statusConfig = {
    'pending': { label: 'Pending', icon: AlertCircle, color: 'text-amber-600 bg-amber-50/60 border-amber-200/50 hover:bg-amber-100/50' },
    'in-progress': { label: 'In Progress', icon: Clock, color: 'text-blue-600 bg-blue-50/60 border-blue-200/50 hover:bg-blue-100/50' },
    'completed': { label: 'Completed', icon: CheckSquare, color: 'text-emerald-600 bg-emerald-50/60 border-emerald-200/50 hover:bg-emerald-100/50' },
};

const priorityConfig = {
    'low': 'bg-slate-100 text-slate-600 border-slate-200',
    'medium': 'bg-blue-50 text-blue-600 border-blue-100',
    'high': 'bg-orange-50 text-orange-600 border-orange-100',
    'urgent': 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse',
};

export function EmployeeTask() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getTaskByEmp();
            // Securely unpack backend envelopes (handles res.data.data, res.data, or plain raw arrays)
            const rawTasks = response?.data?.tasks || response?.data?.data || response?.data || response || [];
            setTasks(Array.isArray(rawTasks) ? rawTasks : []);
        } catch (err: any) {
            setError(err?.message || 'Failed to sync your tasks list.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Close open status menu windows cleanly if user clicks anywhere outside the card option box
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusUpdate = async (taskId: string, nextStatus: Task['status']) => {
        // ⚡ OPTIMISTIC UI UPDATE: Swap statuses instantaneously so layout doesn't lag out
        // setTasks(prev => prev.map(t => t.task._id === taskId ? { ...t, status: nextStatus } : t));
        setTasks(prev => prev.map(t => t.task?._id === taskId ? { ...t, status: nextStatus } : t));
        setOpenDropdown(null);

        try {
            await updateTaskStatusByEmp(taskId, nextStatus);
            toast.success(`Task shifted to ${nextStatus.replace("-", " ")}`);
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to update status on server. Reverting...");
            // Force re-fetch synchronization from database if network request failed completely
            fetchTasks();
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-slate-400 tracking-wide">Syncing assigned task node sheets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] p-4 text-center max-w-sm mx-auto">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 mb-3 shadow-sm">
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-slate-800 font-bold text-sm">Task Sync Failed</h3>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{error}</p>
                <button onClick={fetchTasks} className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm">
                    Retry Synchronization
                </button>
            </div>
        );
    }
    console.log("tasks", tasks);
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 font-sans">

            {/* PAGE TITLE BRAND HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 shadow-sm">
                        <ListTodo size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">My Pipeline Tasks</h1>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                            Track, execute, and update progress states on assigned workspace tasks.
                        </p>
                    </div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200/60 rounded-lg shadow-sm font-mono">
                    Total: {tasks.length}
                </span>
            </div>

            {/* EMPTY ROSTER VIEW GRID */}
            {tasks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto my-6 p-6">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                        <CheckSquare size={26} />
                    </div>
                    <h2 className="text-slate-800 font-extrabold text-base tracking-tight">You're All Caught Up!</h2>
                    <p className="text-slate-400 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
                        No operational task log vectors have been bound to your workspace block key yet. Take a breather!
                    </p>
                </div>
            ) : (
                /* CARDS CORE RENDERING ENGINE GRID */
                <div className="grid grid-cols-1 gap-4" ref={dropdownRef}>
                    {tasks.map((task) => {
                        const activeStatus = statusConfig[task.status] || statusConfig['pending'];
                        const StatusIcon = activeStatus.icon;
                        const priorityClass = priorityConfig[task.priority] || priorityConfig['medium'];

                        return (
                            <div
                                key={task._id}
                                className="group bg-white rounded-2xl border border-slate-100/90 p-5 shadow-sm hover:shadow-md hover:border-teal-500/10 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 min-w-0 flex-1">

                                        {/* Header badges row */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2 py-0.5 border text-[10px] font-extrabold tracking-wider uppercase rounded-md shadow-sm ${priorityClass}`}>
                                                {task?.task?.priority || 'medium'}
                                            </span>
                                        </div>

                                        {/* ⚡ FIX: Direct root structural parsing replaces task.task.title crash loops */}
                                        <h3 className="text-slate-800 font-bold text-base md:text-lg tracking-tight group-hover:text-teal-600 transition-colors truncate">
                                            {task?.task?.title}
                                        </h3>
                                        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
                                            {task?.task?.description}
                                        </p>
                                    </div>

                                    {/* INTERACTIVE CONTROLLER DROPDOWN */}
                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown(openDropdown === task._id ? null : task._id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm transition-all cursor-pointer ${activeStatus.color}`}
                                        >
                                            <StatusIcon size={13} strokeWidth={2.5} />
                                            <span>{activeStatus.label}</span>
                                            <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === task._id ? "rotate-180 text-teal-500" : "text-slate-400"}`} />
                                        </button>

                                        {/* Dropdown Option Panels Overlay Overlay Box */}
                                        {openDropdown === task._id && (
                                            <div className="absolute right-0 mt-2 z-30 bg-white border border-slate-150 rounded-xl shadow-xl overflow-hidden w-40 p-1 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                                                <div className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-50">
                                                    Shift State Track
                                                </div>
                                                {Object.entries(statusConfig).map(([key, value]) => {
                                                    const OptionIcon = value.icon;
                                                    const isSelected = task.status === key;

                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => handleStatusUpdate(task.task?._id, key as Task['status'])}
                                                            className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors text-left ${isSelected
                                                                ? 'bg-slate-50 text-slate-800 pointer-events-none'
                                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
                                                                }`}
                                                        >
                                                            <OptionIcon size={13} className={isSelected ? 'text-teal-500' : 'text-slate-400'} />
                                                            <span className="flex-1 truncate">{value.label}</span>
                                                            {isSelected && <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CARD FOOTER INFO ACCENTS MAP */}
                                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-100/60 text-[11px] text-slate-400 font-medium">
                                    <span className="flex items-center gap-1">
                                        <User size={12} className="text-slate-300" />
                                        Issued by: <span className="font-bold text-slate-600 capitalize">{task.createdBy?.name || 'Workspace Admin'}</span>
                                    </span>

                                    <span className="flex items-center gap-1 font-semibold text-slate-400 font-mono">
                                        <Calendar size={12} className="text-slate-300" />
                                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}