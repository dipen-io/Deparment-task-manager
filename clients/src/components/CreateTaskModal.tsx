import { useState, useEffect } from "react";
import { getEmployees } from "../api/userApi";
import { addTask, updateTask, type Task } from "../api/taskApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
}

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
  // Form State
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [assigneeId, setAssigneeId] = useState(task?.assignee?._id || "");

  // API State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTaskAding, setIsTaskAdding] = useState(false);

  // Fetch employees when the modal opens
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setAssigneeId(task.assignedTo?._id || "");
    }
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const response = await getEmployees();
        setEmployees(response.data);

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

    const newTask = { title, description, status, assigneeId };

    try {
      setIsTaskAdding(true);
      if (task) {
        const response = await updateTask(newTask, task._id);
        console.log(response.data);

        toast.success(response.message);
        onSuccess?.(response.data);
      } else {
        const response = await addTask(newTask);
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
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
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
              {employees.map((emp) => (
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
