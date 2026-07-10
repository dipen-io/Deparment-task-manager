// get request and caching

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers } from "../api/userApi";

// Query keys Centralized startegy
export const userKeys = {
    all: ["tasks"] as const,
    lists: (filters: Object) => [...userKeys.all, "list", filters] as const,
    detail: (id: string) => [...userKeys.all, "detail", id] as const,

};

export function useUser(filters: { status?: string, search?: string }) {
    return useQuery({
        queryKey: userKeys.lists(filters),
        queryFn: () => getUsers(),
        placeholderData: keepPreviousData,
    })
}

// export function useSingleTask(id: string) {
//     return useQuery({
//         queryKey: taskKeys.detail(id),
//         queryFn: () => getSingleTask(id),
//         enabled: !!id, // only run queyr only valid id present
//     })
// }

