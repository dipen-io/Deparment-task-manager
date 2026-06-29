interface UserInfo {
    name: string;
    email?: string;
}

export interface TaskType {
    _id: string;
    title: string;
    description: string;
    status: string;
    assignedTo?: UserInfo;
    createdBy?: string;
    updatedAt?: string;
    createdAt?: string;

}

