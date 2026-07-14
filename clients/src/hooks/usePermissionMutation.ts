import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    createPermission,
    editPermission,
    removePermission,
} from "../api/permissionApi";
import { permKeys } from "./usePermission";
import type { Permission } from "../components/types/rolesType";

export function usePermissionMutations() {
    const queryClient = useQueryClient();

    // ➕ Create Permission Mutation
    const createPermissionMutation = useMutation({
        mutationFn: createPermission,
        onSuccess: (response) => {
            // Invalidate every list cache view to ensure fresh inject occurs
            queryClient.invalidateQueries({ queryKey: permKeys.all });
            toast.success(response.data.message || "Permission created!");
        },
    });

    // ✏️ Update Task Mutation
    const updatePermissionMutation = useMutation({
        mutationFn: ({
            id,
            changedField,
        }: {
            id: string;
            changedField: Permission;
        }) => editPermission(id, changedField),
        onSuccess: (response, variables) => {
            // 1. Refresh global lookup lists
            queryClient.invalidateQueries({ queryKey: permKeys.all });
            // 2. Refresh precise details view instance if matching ID page is open
            queryClient.invalidateQueries({
                queryKey: permKeys.detail(variables.id),
            });

            toast.success(response.data.message || "Task updated!");
        },
    });

    // ❌ Remove Task Mutation
    const deletePermissionMutation = useMutation({
        mutationFn: removePermission,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: permKeys.all });
            toast.success(response?.data?.message || "Permission deleted permanently.");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to remove permission record.");
        },
    });

    return {
        createPermission: createPermissionMutation.mutateAsync, // .mutateAsync allows component await chaining
        // updateTask: updateTaskMutation.mutateAsync,
        deletePermission: deletePermissionMutation.mutateAsync,
        isCreating: createPermissionMutation.isPending,
        // isUpdating: updateTaskMutation.isPending,
        isDeleting: deletePermissionMutation.isPending,

        //department count
        // countDept: getDepartmentCount.mutateAsync,
        // isFetching: getDepartmentCount.isPending,

        // assign memeber & head department
        updatePermission: updatePermissionMutation.mutateAsync,
        isUpdatingPermission: updatePermissionMutation.isPending,
        // isUpdatingRoster: assignMemUsrDept.isPending,

        // unAssign: UnassignMemUsrDept.mutateAsync,
        // isUnassigning: UnassignMemUsrDept.isPaused
    };
}
