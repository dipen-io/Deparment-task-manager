import api from "./axios";

export interface DeparmentData {
    message?: string;
    data: {
        data: {
            _id: string;
            name: string;
            description: string;
            code: string;
            createdAt: string;
            updatedAt: string;
            users: {
                _id: string;
                name: string;
                email: string;
                department: string;
            }[];

            manager: {
                _id: string;
                name: string;
                email: string;
            } | null;
        }[];
        nextCursor: string | null;
        hasMore: boolean;
        limit: number;
    }
    meta: {
        timestamps: string;
        unix: number,
        meta: Record<string, unknown>;
    }
}

export interface AddDepartmentData {
    name: string;
    description?: string;
    code?: string;
}

export interface FilterDept {
    search?: string;
    limit?: number;
    status?: string;
}


export const getDepartment = async (filter: FilterDept): Promise<DeparmentData> => {
    const response = await api.get<DeparmentData>("/dept/get", {
        params: filter
    })
    return response.data;
}

export const createDepartment = async (dept: AddDepartmentData) => {
    const response = await api.post<DeparmentData>("/dept", dept)
    return response.data;
}

export const deleteDepartment = async (deptId: string) => {
    const response = await api.delete(`/dept/${deptId}`);
    return response.data;
}

export const getDeptCount = async () => {
    const response = await api.get("/dept/count");
    console.log("Response: ", response);
    return response.data;
}
