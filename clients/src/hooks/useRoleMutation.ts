import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { roleKeys } from "./useRole";
import { createRole, deleteRoles, updateRoles } from "../api/roleApi"

export function useRolesMutations() {
    const queryClient = useQueryClient();

    // ➕ Create Permission Mutation
    const createRolesMutation = useMutation({
        mutationFn: createRole,
        onSuccess: (response) => {
            // Invalidate every list cache view to ensure fresh inject occurs
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
            toast.success(response.data.message || "Permission created!");
        },
    });

    // ✏️ Update Task Mutation
    const updateRolesMutation = useMutation({
        mutationFn: ({
            id,
            changedField,
        }: {
            id: string;
            changedField: Record<string, any>;
        }) => updateRoles(changedField, id),
        onSuccess: (response, variables) => {
            // 1. Refresh global lookup lists
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
            // 2. Refresh precise details view instance if matching ID page is open
            queryClient.invalidateQueries({
                queryKey: roleKeys.detail(variables.id),
            });

            toast.success(response.message || "Task updated!");
        },
    });

    // ❌ Remove Task Mutation
    const deleteRolesMutation = useMutation({
        mutationFn: deleteRoles,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
            toast.success(response?.data?.message || "Task deleted permanently.");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to remove task record.");
        },
    });

    return {
        createRoles: createRolesMutation.mutateAsync, // .mutateAsync allows component await chaining
        // updateTask: updateTaskMutation.mutateAsync,
        deleteRoles: deleteRolesMutation.mutateAsync,
        isCreating: createRolesMutation.isPending,
        // isUpdating: updateTaskMutation.isPending,
        isDeleting: deleteRolesMutation.isPending,

        //department count
        // countDept: getDepartmentCount.mutateAsync,
        // isFetching: getDepartmentCount.isPending,

        // assign memeber & head department
        updatePermission: updateRolesMutation.mutateAsync,
        isUpdatingPermission: updateRolesMutation.isPending,
        // isUpdatingRoster: assignMemUsrDept.isPending,

        // unAssign: UnassignMemUsrDept.mutateAsync,
        // isUnassigning: UnassignMemUsrDept.isPaused
    };
}
