import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment, deleteDepartment, getDeptCount, assignDept } from "../api/departmentApi";
import { deptKeys } from "./useDepartment";
import toast from "react-hot-toast";
import { userKeys } from "./useUser";

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
  // const updateDeptkMutation = useMutation({
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
  const assignMemUsrDept = useMutation({
    mutationFn: ({ deptId, userId, role, oldMangerId }: { deptId: string, deptCode: string, userId: string, role: string, oldMangerId: string }) => assignDept(deptId, userId, role, oldMangerId),
    onSuccess: (response, variable) => {
      queryClient.invalidateQueries({ queryKey: deptKeys.all });
      queryClient.invalidateQueries({
        // queryKey: ["users", "admin"],
        queryKey: userKeys.admin(variable.deptId, variable.deptCode),
      });
      queryClient.invalidateQueries({ queryKey: deptKeys.detail(variable.deptId) });

      toast.success(response.message || "User Assigned!");
    }
  })
  // ❌ Remove Task Mutation
  const deleteDeptMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: deptKeys.all });
      toast.success(response.message || "Department deleted permanently.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove department record.");
    }
  });

  const getDepartmentCount = useMutation({
    mutationFn: getDeptCount,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: deptKeys.all });
      toast.success(response.message || "Department Count fetched");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to fetch department count.");

    }
  })

  return {
    createDepartment: createTaskMutation.mutateAsync, // .mutateAsync allows component await chaining
    // updateTask: updateTaskMutation.mutateAsync,
    deleteDept: deleteDeptMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    // isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteDeptMutation.isPending,

    //department count 
    countDept: getDepartmentCount.mutateAsync,
    isFetching: getDepartmentCount.isPending,

    // assign memeber & head department
    updateHead: assignMemUsrDept.mutateAsync,
    isUpdatingHead: assignMemUsrDept.isPending,
    isUpdatingRoster: assignMemUsrDept.isPending,

  };
}
