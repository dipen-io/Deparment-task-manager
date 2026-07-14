export interface Role {
    _id: string;
    name: string;
    permission: string[];
}

export interface Department {
    _id: string;
    name: string;
    description: string;
    code: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    userType: string;
    role: Role;
    department?: Department;
}