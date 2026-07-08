
// get request and caching

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDepartment } from "../api/departmentApi";

// Query keys Centralized startegy
export const deptKeys = {
    all: ["dept"] as const,
    lists: (filters: Object) => [...deptKeys.all, "list", filters] as const,
    detail: (id: string) => [...deptKeys.all, "detail", id] as const,

};

export function useDept(filters: {status?: string, search?: string}) {
    return useQuery({
        queryKey: deptKeys.lists(filters),
        queryFn: () => getDepartment(),
        placeholderData: keepPreviousData,
    })
}

/*
export function useSingleTask(id: string) {
    return useQuery({
        queryKey: deptKeys.detail(id),
        queryFn: () => getSingleDept(id),
        enabled: !!id, // only run queyr only valid id present
    })
}
*/

