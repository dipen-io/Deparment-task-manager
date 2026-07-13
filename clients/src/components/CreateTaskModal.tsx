import { useState, useEffect, useRef } from "react";
import { getEmployees } from "../api/userApi";
import { type Task } from "../api/taskApi";
import type { Employee } from "../api/userApi";
import toast from "react-hot-toast";
import { ChevronDown, Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDept } from "../hooks/useDepartment";
import { useTaskMutations } from "../hooks/useTaskMutation";

// type TaskStatus = "pending" | "in-process" | "completed";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface CreateTaskModalProps {
    onClose: () => void;
    task?: Task;
}

export function CreateTaskModal({ onClose, task }: CreateTaskModalProps) {
    const { user } = useAuth();
    const filter = { limit: 100 };
    const { createTask, updateTask } = useTaskMutations();
    const { data: res, isLoading: isDeptLoading } = useDept(filter);

    const departments = res?.data?.data;
    let singleDepartment
    if (user.userType === "head") {
        singleDepartment = user?.department || [];
    }

    console.log("singleDepartment", singleDepartment);
    // Form State
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    // const [status, setStatus] = useState(task?.status || "pending");
    const [priority, setPriority] = useState<TaskPriority>(
        (task?.priority as TaskPriority) || "medium",
    );
    const [assigneeId, setAssigneeId] = useState(task?.assignedTo?._id || "");
    const [createdBy, setCreatedBy] = useState(
        task?.createdBy?._id || user?._id,
    );
    // const [selectedDeptId, setSelectedDeptId] = useState("");
    const [selectedDeptId, setSelectedDeptId] = useState(
        task?.department?._id || task?.department || "",
    );
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // API State
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTaskAding, setIsTaskAdding] = useState(false);

    // Fetch employees when the modal opens
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority as TaskPriority);
            setAssigneeId(task.assignedTo?._id || "");
            setCreatedBy(task.createdBy._id || "");
            setSelectedDeptId(task.department?._id || task.department || "");
        }
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                // Replace with your actual API call
                const { data } = await getEmployees();
                setEmployees(data?.users);
            } catch (error) {
                console.error("Failed to fetch employees", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const changedField: Record<string, any> = {};
        if (title !== (task?.title || "")) changedField.title = title;
        if (description !== (task?.description || ""))
            changedField.description = description;
        if (priority !== (task?.priority || "medium"))
            changedField.priority = priority;

        const currentAssignedId = task?.assignedTo?._id || "";
        if (currentAssignedId !== assigneeId) {
            changedField.assignedTo = assigneeId || null;
        }
        if (selectedDeptId) {
            changedField.department = selectedDeptId;
        }

        if (Object.keys(changedField).length === 0) {
            toast.error("No change made.");
            onClose();
            return;
        }

        // const newTask = { title, description, priority, assigneeId, createdBy };

        try {
            setIsTaskAdding(true);
            if (task) {
                await updateTask({
                    changedField: changedField,
                    id: task._id,
                });
            } else {
                const newTask = {
                    title,
                    description,
                    priority,
                    assigneeId,
                    createdBy,
                    department: selectedDeptId,
                };
                await createTask(newTask);
            }
        } catch (error) {
            console.error("Failed to add task: ", error);
        } finally {
            setIsTaskAdding(false);
        }
        onClose();
    };

    const filteredDepartments =
        departments?.filter((dept) => {
            if (!search.trim()) return true;
            return dept.name
                ?.toLowerCase()
                .includes(search.toLowerCase().trim());
        }) || [];

    const currentSelectedName =
        departments?.find((d) => d._id === selectedDeptId)?.name ||
        "Select a department";

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Create New Task</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                            placeholder="e.g., Update landing page"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                            rows={3}
                            placeholder="Task details..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value as TaskPriority)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign To (Optional)
                        </label>
                        <select
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            disabled={isDeptLoading}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                        >
                            <option value="">Unassigned</option>
                            {employees?.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign A Department (Optional)
                        </label>

                        {/* 🔘 THE TRIGGER BUTTON: Looks exactly like a form select field row */}
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => {
                                setIsOpen(!isOpen);
                                setSearch(""); // Reset search string whenever the panel opens/closes
                            }}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm text-left bg-white flex justify-between items-center transition-all focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent disabled:opacity-50 shadow-sm cursor-pointer"
                        >
                            <span
                                className={
                                    selectedDeptId
                                        ? "text-gray-900 font-medium"
                                        : "text-gray-400"
                                }
                            >
                                {currentSelectedName}
                            </span>
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#14b8a6]" : ""}`}
                            />
                        </button>

                        {/* 📂 ABSOLUTE FLOATING PANEL: Reveals search bar and option cards conditional loop gate */}
                        {isOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-2 space-y-2 max-w-[calc(100vw-2rem)] md:max-w-md animate-fade-in">
                                {/* 🔍 SEARCH OPTION BOX: Visible ONLY when panel overlay opens */}
                                {user?.userType !== "head" && (
                                    <div className="relative">
                                        <Search
                                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={14}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Search department list..."
                                            value={search}
                                            autoFocus // Focuses input keyboard layer instantly on mounting
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 bg-slate-50 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20"
                                        />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch("")}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                )}


                                {/* 📋 SCROLLABLE LIST OF DEPARTMENTS */}
                                <div className="max-h-48 overflow-y-auto divide-y divide-gray-50 text-xs">
                                    {/* Clear selection null value row options */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedDeptId(""); // Clears assigned sector parameters
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-2.5 py-2 rounded-md transition-colors ${!selectedDeptId ? "bg-teal-50 text-[#14b8a6] font-bold" : "text-gray-500 hover:bg-slate-50 italic"}`}
                                    >
                                        -- Leave Unassigned --
                                    </button>

                                    {/* Filtered Data Cards Mapping Elements */}
                                    {user?.userType === "head" ? (
                                        <button
                                            key={singleDepartment._id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDeptId(singleDepartment._id); // Binds schema matching Object ID string references
                                                setIsOpen(false); // Closes menu panel cleanly
                                            }}
                                            className={`w-full text-left px-2.5 py-2 rounded-md transition-colors truncate block ${selectedDeptId === singleDepartment._id ? "bg-teal-50 text-[#14b8a6] font-bold" : "text-gray-600 hover:bg-slate-50"}`}
                                        >
                                            {singleDepartment.name}{" "}
                                            {singleDepartment.code
                                                ? `[${singleDepartment.code}]`
                                                : ""}
                                        </button>
                                    ) : (filteredDepartments.length > 0 ? (
                                        filteredDepartments.map((dept) => (
                                            <button
                                                key={dept._id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDeptId(dept._id); // Binds schema matching Object ID string references
                                                    setIsOpen(false); // Closes menu panel cleanly
                                                }}
                                                className={`w-full text-left px-2.5 py-2 rounded-md transition-colors truncate block ${selectedDeptId === dept._id ? "bg-teal-50 text-[#14b8a6] font-bold" : "text-gray-600 hover:bg-slate-50"}`}
                                            >
                                                {dept.name}{" "}
                                                {dept.code
                                                    ? `[${dept.code}]`
                                                    : ""}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-gray-400 italic text-[11px]">
                                            No departments match your search
                                            phrase.
                                        </div>
                                    ))}

                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#14b8a6]/90 transition-colors"
                        >
                            {isTaskAding
                                ? task
                                    ? "Updating..."
                                    : "Adding Task..."
                                : task
                                    ? "Update Task"
                                    : "Save Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
