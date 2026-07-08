import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "../api/departmentApi";
import { deptKeys } from "./useDepartment";
import toast from "react-hot-toast";

export function useDeptMutations() {
  const queryClient = useQueryClient();

  // ➕ Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: (response) => {
      // Invalidate every list cache view to ensure fresh inject occurs
      queryClient.invalidateQueries({ queryKey: deptKeys.all });
      toast.success(response.message || "Task created!");
    },
  });

  // ✏️ Update Task Mutation
  // const updateTaskMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(data, id),
  //   onSuccess: (response, variables) => {
  //     // 1. Refresh global lookup lists
  //     queryClient.invalidateQueries({ queryKey: taskKeys.all });
  //     // 2. Refresh precise details view instance if matching ID page is open
  //     queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
  //
  //     toast.success(response.message || "Task updated!");
  //   },
  // });

  // ❌ Remove Task Mutation
  // const deleteTaskMutation = useMutation({
  //   mutationFn: removeTask,
  //   onSuccess: (response) => {
  //     queryClient.invalidateQueries({ queryKey: taskKeys.all });
  //     toast.success(response.message || "Task deleted permanently.");
  //   },
  // });

  return {
    createDepartment: createTaskMutation.mutateAsync, // .mutateAsync allows component await chaining
    // updateTask: updateTaskMutation.mutateAsync,
    // deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    // isUpdating: updateTaskMutation.isPending,
    // isDeleting: deleteTaskMutation.isPending,
  };
}
