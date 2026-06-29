// import type { Role } from "../components/types/userType";
import type { RoleForm } from "../components/types/rolesType";
import api from "./axios";

export interface UpdateRolePaylaod {
    toAdd: string[];
    toRemove: string[];
}

export const createRole = (data: RoleForm) => {
    const response = api.post("/role", data);
    return response;
};

export const getRole = () => {
    console.log("this is running.....................");
    const response = api.get("/role");
    console.log("RESPONSE FROM ROLE ", response);
    return response;
};

export const deleteRoles = (roleId: string) => {
    const response = api.delete(`/role/${roleId}`);
    return response;
};

export const updateRoles = (roleId: string, data: UpdateRolePaylaod) => {
    const response = api.patch(`/role/${roleId}`, data);
    return response;
};

export const assingUserRole = (roleId: string, userId: string) => {
    const response = api.put(`/role/${userId}`, {
        roleId,
    });
    return response;
};
