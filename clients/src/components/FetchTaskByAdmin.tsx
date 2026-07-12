import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LoadingSpinner } from "./LoadingSpinner";
import {
    getTasks,
    removeTask,
    type Task,
    type TaskResponse,
} from "../api/taskApi";
import { Clock, PlayCircle, CheckCircle, Search, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { CreateTaskModal } from "./CreateTaskModal";
import { useTask } from "../hooks/useTask";
import { useTaskMutations } from "../hooks/useTaskMutation";

type FilterType = "all" | "pending" | "in-progress" | "completed";

export function AllTasks() {
    const [deleting, setisDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskss, setTasks] = useState<Task[]>([]); //TODO: remove this
    // Store the meta data so we can use it for pagination later!
    // const [_meta, setMeta] = useState<TaskResponse["meta"] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    const location = useLocation();

    const segment = location.pathname.split("/").filter(Boolean)[0];

    // Filters
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = useState(""); // Let's use your backend search too!
    const [debounchSearch, setDebounceSearch] = useState("");

    const { deleteTask } = useTaskMutations();

    const removeTaskkk = async (id: string) => {
        setisDeleting(true);
        setDeletingId(id);
        try {
            await deleteTask(id);
            // setTasks((prev) => prev.filter((task) => task._id !== id));
            // toast.success(res.message);
        } catch (error) {
            console.log(error.message);
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
    } = useTask({
        status: activeFilter != "all" ? activeFilter : undefined,
        search: debounchSearch || undefined,
    });
    const tasks = response?.data?.tasks || [];
    // const meta = response?.meta || null;

    // 1. Notice activeFilter and searchQuery are now in the dependency array!
    useEffect(() => {
        /*
    const fetchTasks = async () => {
      try {
        setIsLoading(true);

        // Build the params object. If filter is 'all', we don't send a status param.
        const params: any = {};
        if (activeFilter !== "all") params.status = activeFilter;
        if (searchQuery) params.search = searchQuery;

        const { data, meta } = await getTasks(params);

        setTasks(data.tasks || []);
        setMeta(meta || null); // Save pagination data
      } catch (err: any) {
        setError(err.customMessage || "Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    */
        // Add a small delay (debounce) for search so we don't spam the API on every keystroke
        const delayDebounceFn = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [activeFilter, searchQuery]); // Re-run when these change!

    const renderStatusBadge = (status: Task["status"]) => {
        // ... (Keep your exact same renderStatusBadge switch statement here)
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

    // const handleTaskUpdated = (updatedTask: Task) => {
    //   setTasks((prev) =>
    //     prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
    //   );
    // };
    const handleTaskUpdated = (updatedTask: any) => {
        setTasks((prev) =>
            prev.map((task) => {
                if (task._id === updatedTask._id) {
                    // Normalize the backend response structure to match what the grid expects
                    return {
                        ...updatedTask,
                        // Extract assignedTo out of the assignment object if it exists there
                        assignedTo:
                            updatedTask.assignment?.assignedTo ||
                            updatedTask.assignedTo,
                        status:
                            updatedTask.assignment?.status ||
                            updatedTask.status,
                    };
                }
                return task;
            }),
        );
    };

    const handleTaskCreated = (newTask: Task) => {
        setTasks((prev) => [newTask, ...prev]);
    };

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
                            "in-progress",
                            "completed",
                        ] as FilterType[]
                    ).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                                activeFilter === filter
                                    ? "bg-[#14b8a6] text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {filter.replace("-", " ")}
                        </button>
                    ))}
                </div>

                {/* Since your backend has a search feature, let's add a search bar! */}
                {/* Search Bar & New Add Task Option Row */}
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

                    {/* ✅ THE NEW ADD TASK OPTION BUTTON */}
                    <button
                        onClick={() => {
                            setSelectedTask(null); // Clear selected to tell modal it's a NEW task
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
                <div className="relative mt-43 mr-70 justify-start">
                    <LoadingSpinner />
                </div>
            )}
            {/*
          // {error && <div className="text-red-500 text-center py-10">{error}</div>}
      */}
            {error && (
                <div className="italic text-gray-700 text-center py-10">
                    please check internet
                </div>
            )}

            {/* modal for editing task  */}
            {/*      {selectedTask && (
        <CreateTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSuccess={handleTaskUpdated}
        />
      )} */}
            {isModalOpen && (
                <CreateTaskModal
                    task={selectedTask || undefined} // Passes existing task data for Edit mode, or undefined for Create mode
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTask(null);
                    }}
                    onSuccess={
                        selectedTask ? handleTaskUpdated : handleTaskCreated
                    }
                />
            )}

            {/* --- Task Grid --- */}
            {!isLoading && !error && tasks.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-200">
                    No tasks found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!isLoading &&
                        tasks.map((task) => (
                            <div
                                key={task._id}
                                className="hover:bg-slate-200 bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm"
                            >
                                {/* ✅ Link only wraps the content, not the buttons */}
                                <Link to={`/${segment}/task/${task._id}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                            {task.title}
                                        </h3>

                                        <div className="flex gap-2">
                                            <span className="italic text-xs bg-gray-100 text-gray-700 font-medium rounded-xl px-3 py-1">
                                                {task.priority}
                                            </span>
                                            {renderStatusBadge(task.status)}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                        {task.description}
                                    </p>
                                    <div className="pt-2 text-sm">
                                        <span className="text-gray-600 font-medium">
                                            {task.assignedTo
                                                ? `Assigned to: ${task.assignedTo.name}`
                                                : "Unassigned"}
                                        </span>
                                    </div>

                                    <div className="pt-2 text-sm">
                                        <span className="text-gray-600 font-medium">
                                            {task.department
                                                ? `Department: ${task.department.name}`
                                                : "N/A"}
                                        </span>
                                    </div>
                                </Link>

                                {/* ✅ Buttons outside Link — no navigation on click */}
                                <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-3 mt-2">
                                    <span
                                        className="bg-red-400 hover:bg-red-500 text-white text-sm font-medium p-1.5 rounded cursor-pointer"
                                        onClick={() => removeTaskkk(task._id)}
                                    >
                                        {deleting && deletingId === task._id
                                            ? "Deleting..."
                                            : "Remove"}
                                    </span>
                                    <span
                                        className="bg-green-400 hover:bg-green-500 text-white text-sm font-medium p-1.5 rounded cursor-pointer"
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
