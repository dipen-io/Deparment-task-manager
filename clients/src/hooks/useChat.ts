// get request and caching
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getChatHistory } from "../api/chat";

// Query keys Centralized startegy
export const chatKeys = {
    all: ["chat"] as const,
    lists: () => [...chatKeys.all, "list"] as const,
    details: () => [...chatKeys.all, "detail"] as const,
    detail: (id: string) => [...chatKeys.all, "detail", id] as const,
};

export function UseGetChat({ deptId }) {
    return useQuery({
        // queryKey: chatKeys.lists(),
        queryKey: ['chat', deptId],
        queryFn: () => getChatHistory(deptId),
        enabled: !!deptId,
        placeholderData: keepPreviousData,
    });
}

// export function GetMyRole(roleId: string) {
//     return useQuery({
//         queryKey: roleKeys.detail(roleId),
//         queryFn: () => getUserRolesWithId(roleId),
//         placeholderData: keepPreviousData
//     });
// }
