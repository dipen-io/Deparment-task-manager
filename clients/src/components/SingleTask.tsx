import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getSingleTask } from "../api/taskApi";
import { Clock, User, CheckCircle, PlayCircle } from "lucide-react";

export function SingleTask() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [meta, setMeta] = useState<{
    accessedByName: string;
    accessedByRole: string;
  } | null>(null);

  const renderStatus = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle size={16} /> Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <PlayCircle size={16} /> In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <Clock size={16} /> Pending
          </span>
        );
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await getSingleTask(id!);
        setTask(data.taskData);
        setMeta({
          accessedByName: data.accessedByName,
          accessedByRole: data.accessedByRole,
        });
      } catch (err) {
        console.error("Failed to fetch task");
      }
    };

    fetchTask();
  }, [id]);
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-gray-800">{task?.title}</h1>
        {renderStatus(task?.status)}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-1">
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed">{task?.description}</p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assigned To */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            <User size={14} /> Assigned To
          </h3>
          <p className="text-gray-800 font-medium">
            {task?.assignedTo?.name || "Unassigned"}
          </p>
          <p className="text-gray-500 text-sm">{task?.assignedTo?.email}</p>
        </div>

        {/* Created By */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1">Created By</h3>
          <p className="text-gray-800 font-medium">{task?.createdBy?.name}</p>
        </div>

        {/* Created At */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1">Created At</h3>
          <p className="text-gray-800">
            {new Date(task?.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Updated At */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
          <p className="text-gray-800">
            {new Date(task?.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-sm text-gray-500 border-t pt-4 flex justify-between">
        <span>Viewed by name : {meta?.accessedByName}</span>
        <span>Role: {meta?.accessedByRole}</span>
      </div>
    </div>
  );
}
