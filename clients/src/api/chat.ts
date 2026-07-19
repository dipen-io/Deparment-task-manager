import api from "./axios";

export const getChatHistory = async (deptId: string) => {
    const response = await api.get(`/dept/chat/${deptId}`);
    return response.data;
}