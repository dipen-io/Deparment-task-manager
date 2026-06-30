import api from "./axios";  

export interface DeparmentData {
    data: {
        data: {
            _id: string;
            name: string;
            description: string;
            createdAt: string;
            updatedAt: string;
            users: {
                _id: string;
                name: string;
                email: string;
                department: string;
            }[];
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


export const getDepartment = async(): Promise<DeparmentData> => {
    const response  = await api.get<DeparmentData>("/dept/get")
    return response.data;
}

