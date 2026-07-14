
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LoadingSpinner } from "./LoadingSpinner";
import { type Task } from "../api/taskApi";
import {
    Clock,
    PlayCircle,
    CheckCircle,
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { CreateTaskModal } from "./CreateTaskModal";
import { useTaskByHead } from "../hooks/useTask";
import { useTaskMutations } from "../hooks/useTaskMutation";

type FilterType = "all" | "pending" | "in-process" | "completed";

export function TaskByHead() {
    const [deleting, setisDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();
    const segment = location.pathname.split("/").filter(Boolean)[0];

    // Filters & Pagination States
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debounchSearch, setDebounceSearch] = useState("");
    const [page, setPage] = useState(1);

    const { deleteTask } = useTaskMutations();
    const removeTaskkk = async (id: string) => {
        setisDeleting(true);
        setDeletingId(id);
        try {
            await deleteTask(id);
        } catch (err: any) {
            console.error("error", err);
            toast.error("error deleting task");
        } finally {
            setisDeleting(false);
            setDeletingId(null);
        }
    };

    const {
        data: response,
        isLoading,
        error,
    } = useTaskByHead({
        status: activeFilter !== "all" ? activeFilter : undefined,
        search: debounchSearch || undefined,
        page: page,
        limit: 6,
    });
    const tasks = response?.data || [];

    const pagination = response?.data?.pagination || {
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10,
        totalCount: 0,
        totalPages: 1,
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleNextPage = () => {
        if (pagination.hasNextPage) setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (pagination.hasPrevPage) setPage((prev) => Math.max(prev - 1, 1));
    };

    const renderStatusBadge = (status: Task["status"]) => {
        switch (status) {
            case "completed":
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle size={14} /> Completed
                    </span>
                );
            case "in-progress":
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <PlayCircle size={14} /> In Progress
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        <Clock size={14} /> Pending
                    </span>
                );
        }
    };

    console.log("selectedTask: ", selectedTask);

    return (
        <div>
            {/* --- Controls Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                {/* Status Tabs */}
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 w-full md:w-auto">
                    {(
                        [
                            "all",
                            "pending",
                            "in-process",
                            "completed",
                        ] as FilterType[]
                    ).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => {
                                setActiveFilter(filter);
                                setPage(1);
                            }}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${activeFilter === filter
                                ? "bg-[#14b8a6] text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {filter.replace("-", " ")}
                        </button>
                    ))}
                </div>

                {/* Search Bar & Add Button */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setSelectedTask(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                    >
                        <Plus size={16} /> Add Task
                    </button>
                </div>
            </div>

            {/* --- State Handling --- */}
            {isLoading && (
                <div className="flex justify-center py-10">
                    <LoadingSpinner />
                </div>
            )}

            {error && (
                <div className="italic text-gray-700 text-center py-10">
                    please check internet connection
                </div>
            )}

            {/* Modal for editing task */}
            {isModalOpen && (
                <CreateTaskModal
                    task={selectedTask || undefined}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTask(null);
                    }}
                />
            )}

            {/* --- Task Grid --- */}
            {!isLoading && !error && tasks.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-200">
                    No tasks found.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!isLoading && tasks &&
                            tasks?.map((task: any) => (
                                <div
                                    key={task._id}
                                    className="hover:bg-slate-50 transition-colors bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-sm"
                                >
                                    <Link
                                        to={`/${segment}/task/${task._id}`}
                                        className="block flex-1"
                                    >
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                                {task.title}
                                            </h3>

                                            <div className="flex gap-2 shrink-0">
                                                <span className="italic text-xs bg-gray-100 text-gray-700 font-medium rounded-xl px-3 py-1">
                                                    {task.priority}
                                                </span>
                                                {renderStatusBadge(task.status)}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {task.description}
                                        </p>

                                        <div className="space-y-1 text-xs text-gray-500 border-t border-gray-50 pt-3 mt-auto">
                                            <div>
                                                {/* FUCKED */}
                                                <span className="font-semibold text-gray-600">
                                                    Assigned:
                                                </span>{" "}
                                                {task.assignedTo?.name
                                                    ? task.assignedTo.name
                                                    : "Unassigned"}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">
                                                    Sector:
                                                </span>{" "}
                                                {task.department
                                                    ? task.department.name
                                                    : "N/A"}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-3 mt-4">
                                        <button
                                            onClick={() =>
                                                removeTaskkk(task._id)
                                            }
                                            className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                        >
                                            {deleting && deletingId === task._id
                                                ? "Deleting..."
                                                : "Remove"}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTask(task);
                                                setIsModalOpen(true);
                                            }}
                                            className="bg-slate-50 hover:bg-slate-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* ⚡ NEW: PAGINATION FOOTER CONTROL PANEL */}
                    {!isLoading && tasks.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500 font-medium">
                                Showing page{" "}
                                <span className="text-gray-800 font-bold">
                                    {pagination.currentPage}
                                </span>{" "}
                                of{" "}
                                <span className="text-gray-800 font-bold">
                                    {pagination.totalPages || 1}
                                </span>
                                <span className="text-gray-400 mx-1.5">•</span>{" "}
                                Total Records: {pagination.totalCount}
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!pagination.hasPrevPage}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!pagination.hasNextPage}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
