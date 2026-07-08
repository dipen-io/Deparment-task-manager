import { useParams } from "react-router";
import { Clock, User, CheckCircle, PlayCircle } from "lucide-react";
import { useSingleTask } from "../hooks/useTask";

export function SingleTask() {
  const { id } = useParams();


  const {data: taskDetails, isLoading, isError} = useSingleTask(id!);

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


// ⏳ Handle Loading and Error views cleanly
  if (isLoading) return <div className="text-center py-20">Loading task details...</div>;
  if (isError || !taskDetails?.data) return <div className="text-center py-20 text-red-500">Failed to load task details.</div>;

  // 📦 Safely extract values from your custom hook's nested payload structure
  const serverPayload = taskDetails.data;
  const task = serverPayload?.taskData?.task || null;
  const assignedTo = serverPayload?.taskData?.assignedDetails || null;
  const meta = {
    accessedByName: serverPayload?.accessedByName || "",
    accessedByRole: serverPayload?.accessedByRole || "",
  };

  // useEffect(() => {
  //   const fetchTask = async () => {
  //     try {
  //       const { data } = await getSingleTask(id!);
  //       setTask(data.taskData.task);
  //       console.log("SINGLE TASK: ", data);
  //       setAssignedTo(data.taskData.assignedDetails)
  //       setMeta({
  //         accessedByName: data.accessedByName,
  //         accessedByRole: data.accessedByRole,
  //       });
  //     } catch (err) {
  //       console.error("Failed to fetch task");
  //     }
  //   };
  //
  //   fetchTask();
  // }, [id]);
  return (
    <div className="max-w-3xl mx-40 mt-10 bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-gray-800">{task?.title}</h1>
        {task && renderStatus(task?.status)}
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
            {assignedTo?.name || "Unassigned"}
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
            {/* {new Date(task?.createdAt).toLocaleString()} */}
            {/* {task ? new Date(task.createdAt).toLocaleString() : "-"} */}
            {task?.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
          </p>
        </div>

        {/* Updated At */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
          <p className="text-gray-800">
            {/* {new Date(task?.updatedAt).toLocaleString()} */}
            {/* {task ? new Date(task.updatedAt).toLocaleString() : "-"} */}
            {task?.updatedAt ? new Date(task.updatedAt).toLocaleString() : "-"}
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
