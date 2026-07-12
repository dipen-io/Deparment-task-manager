// get request and caching

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTasks, getSingleTask } from "../api/taskApi";

// Query keys Centralized startegy
export const taskKeys = {
    all: ["tasks"] as const,
    lists: (filters: Object) => [...taskKeys.all, "list", filters] as const,
    detail: (id: string) => [...taskKeys.all, "detail", id] as const,
};

export function useTask(filters: {
    status?: string;
    search?: string;
    limit: number;
    page: number;
}) {
    return useQuery({
        queryKey: taskKeys.lists(filters),
        queryFn: () => getTasks(filters),
        placeholderData: keepPreviousData,
    });
}

export function useSingleTask(id: string) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => getSingleTask(id),
        enabled: !!id, // only run queyr only valid id present
    });
}
