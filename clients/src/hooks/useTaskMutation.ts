// POST, PUT, DELETE OPERATION
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask, removeTask, updateTask } from "../api/taskApi";
import toast from "react-hot-toast";
import { taskKeys } from "./useTask";

export function useTaskMutations() {
    const queryClient = useQueryClient();

    // ➕ Create Task Mutation
    const createTaskMutation = useMutation({
        mutationFn: addTask,
        onSuccess: (response) => {
            // Invalidate every list cache view to ensure fresh inject occurs
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            toast.success(response.message || "Task created!");
        },
    });

    // ✏️ Update Task Mutation
    const updateTaskMutation = useMutation({
        mutationFn: ({
            id,
            changedField,
        }: {
            id: string;
            changedField: Record<string, any>;
        }) => updateTask(changedField, id),
        onSuccess: (response, variables) => {
            // 1. Refresh global lookup lists
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            // 2. Refresh precise details view instance if matching ID page is open
            queryClient.invalidateQueries({
                queryKey: taskKeys.detail(variables.id),
            });

            toast.success(response.message || "Task updated!");
        },
    });

    // ❌ Remove Task Mutation
    const deleteTaskMutation = useMutation({
        mutationFn: removeTask,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            toast.success(response.message || "Task deleted permanently.");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to remove task record.");
        },
    });

    return {
        createTask: createTaskMutation.mutateAsync, // .mutateAsync allows component await chaining
        // updateTask: updateTaskMutation.mutateAsync,
        deleteTask: deleteTaskMutation.mutateAsync,
        isCreating: createTaskMutation.isPending,
        // isUpdating: updateTaskMutation.isPending,
        isDeleting: deleteTaskMutation.isPending,

        //department count
        // countDept: getDepartmentCount.mutateAsync,
        // isFetching: getDepartmentCount.isPending,

        // assign memeber & head department
        updateTask: updateTaskMutation.mutateAsync,
        isUpdatingTask: updateTaskMutation.isPending,
        // isUpdatingRoster: assignMemUsrDept.isPending,

        // unAssign: UnassignMemUsrDept.mutateAsync,
        // isUnassigning: UnassignMemUsrDept.isPaused
    };
}
