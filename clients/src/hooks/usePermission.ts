// get request and caching
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPermission } from "../api/permissionApi";

// Query keys Centralized startegy
export const permKeys = {
    all: ["perm"] as const,
    lists: () => [...permKeys.all, "list"] as const,
    detail: (id: string) => [...permKeys.all, "detail", id] as const,
};

export function UseGetPermission() {
    return useQuery({
        queryKey: permKeys.lists(),
        queryFn: () => getPermission(),
        placeholderData: keepPreviousData,
    });
}
