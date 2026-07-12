export interface Permission {
    _id?: string;
    name: string;
    desc: string;
}

export interface Role {
    _id: string;
    name: string;
    desc: string;
    permission: Permission[];
}

export interface RoleForm {
    roleName: string;
    permissionId: string[];
}
