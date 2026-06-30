// import type { Role } from "../components/types/userType";
import type { RoleForm } from "../components/types/rolesType";
import api from "./axios";
import type { Role } from "../components/types/rolesType";

export interface RoleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Role[];
  meta: {
    timestamps: string;
    unix: number;
    meta: Record<string, unknown>;
  };
}

export interface UpdateRolePaylaod {
    toAdd: string[];
    toRemove: string[];
}

export const createRole = (data: RoleForm) => {
    const response = api.post("/role", data);
    return response;
};

export const getRole =  async(): Promise<RoleResponse> => {
    const response = await api.get("/role");
    return response.data;
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
