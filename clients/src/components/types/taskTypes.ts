interface UserInfo {
    _id: string;
    name: string;
    email?: string;
}

export interface TaskType {
    _id: string;
    title: string;
    description: string;
    status: string;
    assignedTo?: UserInfo;
    createdBy?: UserInfo;
    updatedAt?: string;
    createdAt?: string;

}

