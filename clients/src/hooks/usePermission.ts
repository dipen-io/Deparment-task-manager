// get request and caching
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPermission } from "../api/permissionApi";

// Query keys Centralized startegy
export const deptKeys = {
    all: ["roles"] as const,
    lists: () => [...deptKeys.all, "list"] as const,
    detail: (id: string) => [...deptKeys.all, "detail", id] as const,
};

export function UseGetDepartment() {
    return useQuery({
        queryKey: deptKeys.lists(),
        queryFn: () => getPermission(),
        placeholderData: keepPreviousData,
    });
}
