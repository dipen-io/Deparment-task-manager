import api from "./axios";

// create new task
export const addTask = async (task: any) => {
    const res = await api.post("/task/create", task);
    return res.data;
};

export const updateTask = async (task: any, id: string) => {
    const res = await api.patch(`/task/${id}`, task);
    return res.data;
};

export const getSingleTask = async (id: string) => {
    const res = await api.get(`/task/${id}`);
    return res.data;
};

export interface Task {
    assignee: {
        _id: string;
        name: string;
        email: string;
    };
    _id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
    createdBy: {
        _id: string;
        name: string;
    };
    department: {
        _id: string;
        name: string;
        code: string;
    };
    createdAt: string;
    updatedAt: string;
}
export interface Pagination {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    totalCount: number;
    totalPages: number;
}

export interface TaskResponse {
    data: {
        tasks: Task[];
        pagination: Pagination;
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number; // 👈 You had this in your backend, let's add it here!
    };
}

// Update the function to accept optional parameters
export const getTasks = async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    assignedTo?: string;
}): Promise<TaskResponse> => {
    // Axios will automatically convert the params object into ?status=xxx&page=1
    const res = await api.get<TaskResponse>("/task/admin/task", { params });
    return res.data;
};

export const removeTask = async (id: string) => {
    const res = await api.delete(`/task/${id}`);
    return res.data;
};

export const getTaskByEmp = async () => {
    const res = await api.get("/task/my-tasks");
    return res.data;
};
export const getTaskByHead = async () => {
    const res = await api.get("/task/myself-task");
    return res.data;
};

export const updateTaskStatusByEmp = async (id: string, status: string) => {
    const res = await api.patch(`/task/${id}`, { status: status });
    return res.data;
};

// PUBLIC API
// get department enumValues
export const getDeptEnum = async () => {
    const res = await api.get(`/dept`);
    return res.data;
};

// get task count
export const getTaskCount = async () => {
    const res = await api.get(`/task/count`);
    return res.data;
};
