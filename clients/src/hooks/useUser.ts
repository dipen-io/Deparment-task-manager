// get request and caching

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers, getUsersByAdmin } from "../api/userApi";

// Query keys Centralized startegy
export const userKeys = {
    all: ["users"] as const,
    lists: (filters: Object) => [...userKeys.all, "list", filters] as const,
    detail: (id: string) => [...userKeys.all, "detail", id] as const,

    admin: (deptId: string, deptCode: string) => [...userKeys.all, "admin", deptId, deptCode] as const

};

export function useUser(filters: { status?: string, search?: string }) {
    return useQuery({
        queryKey: userKeys.lists(filters),
        queryFn: () => getUsers(),
        placeholderData: keepPreviousData,
    })
}

export function user_member_head(deptId: string, deptCode: string) {
    return useQuery({
        queryKey: userKeys.admin(deptId, deptCode),
        queryFn: () => getUsersByAdmin(deptId, deptCode),
        placeholderData: keepPreviousData,
        enabled: !!deptId && !!deptCode,
    })
}


// export function useSingleTask(id: string) {
//     return useQuery({
//         queryKey: taskKeys.detail(id),
//         queryFn: () => getSingleTask(id),
//         enabled: !!id, // only run queyr only valid id present
//     })
// }

