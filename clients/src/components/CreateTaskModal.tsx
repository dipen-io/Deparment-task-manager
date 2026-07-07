import { useState, useEffect } from "react";
import { getEmployees } from "../api/userApi";
import { addTask, updateTask, type Task } from "../api/taskApi";
import type { Employee } from "../api/userApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";


// type TaskStatus = "pending" | "in-process" | "completed";
type TaskPriority = "low" |  "medium" | "high" | "urgent";

interface CreateTaskModalProps {
  onClose: () => void;
  task?: Task;
  onSuccess?: (task: Task) => void;
}

export function CreateTaskModal({
  onClose,
  task,
  onSuccess,
}: CreateTaskModalProps) {


  const { user } = useAuth();
  // Form State
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  // const [status, setStatus] = useState(task?.status || "pending");
  const [priority, setPriority] = useState<TaskPriority>((task?.priority as TaskPriority) || "medium");
  const [assigneeId, setAssigneeId] = useState(task?.assignedTo?._id || "");
  const [createdBy, setCreatedBy] = useState(task?.createdBy?._id || user?._id);

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
    }
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const {data} = await getEmployees();
        setEmployees(data?.users);

        // Mock data for testing:
        // setEmployees([
        //   { id: '1', name: 'Alice Johnson' },
        //   { id: '2', name: 'Bob Smith' }
        // ]);
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
    if (description !== (task?.description || "")) changedField.description = description;
    if (priority !== (task?.priority || "medium")) changedField.priority = priority;

    const currentAssignedId = task?.assignedTo?._id || "";
    if (currentAssignedId !== assigneeId) {
        changedField.assignedTo = assigneeId || null;
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
        const response = await updateTask(changedField, task._id);
        console.log("response: ", response);

        onSuccess?.(response.data);
        toast.success(response.message);
      } else {
          const newTask = { title, description, priority, assigneeId, createdBy };
          const response = await addTask(newTask);
          onSuccess?.(response.data);
          toast.success(response.message);
      }
    } catch (error) {
      console.error("Failed to add task", error);
    } finally {
      setIsTaskAdding(false);
    }

    onClose();
  };


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
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
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
              disabled={isLoading}
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
