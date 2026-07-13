// get request and caching
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getRole, getUserRolesWithId } from "../api/roleApi";

// Query keys Centralized startegy
export const roleKeys = {
    all: ["roles"] as const,
    lists: () => [...roleKeys.all, "list"] as const,
    details: () => [...roleKeys.all, "detail"] as const,
    detail: (id: string) => [...roleKeys.all, "detail", id] as const,


    // admin: (deptId: string, deptCode: string) =>
    // [...roleKeys.all, "admin", deptId, deptCode] as const,
};

// export function getRoles(filters: { status?: string; search?: string }) {
export function UseGetRole() {
    return useQuery({
        queryKey: roleKeys.lists(),
        queryFn: () => getRole(),
        placeholderData: keepPreviousData,
    });
}

export function GetMyRole(roleId: string) {
    return useQuery({
        queryKey: roleKeys.detail(roleId),
        queryFn: () => getUserRolesWithId(roleId),
        placeholderData: keepPreviousData
    });
}
