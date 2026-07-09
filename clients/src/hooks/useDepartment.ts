
// get request and caching

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDepartment, getDeptCount } from "../api/departmentApi";

// Query keys Centralized startegy
export const deptKeys = {
    all: ["dept"] as const,
    lists: (filters: Object) => [...deptKeys.all, "list", filters] as const,
    detail: (id: string) => [...deptKeys.all, "detail", id] as const,
    count: () => [...deptKeys.all, "count"] as const,

};

export const deptCountOptions = {
    queryKey: deptKeys.count(),
    queryFn: getDeptCount,
    staleTime: 1000 * 60 * 2, // 2 minutes stale window cache
};


export function useDept(filters: { page?: number, search?: string, limit?: number }) {
    return useQuery({
        queryKey: deptKeys.lists(filters),
        queryFn: () => getDepartment(filters),
        placeholderData: keepPreviousData,
    })
}

export function useDeptCount() {
    const countQuery = useQuery(deptCountOptions);

    return {
        countDept: countQuery.refetch,      // Manual refetch action channel
        totalCount: countQuery.data || 0,   // Raw numerical count baseline fallback
        isFetching: countQuery.isFetching,  // Loading/Fetching state tracking
    };
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

