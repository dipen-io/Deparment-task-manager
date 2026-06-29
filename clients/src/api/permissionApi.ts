import type { Permission } from "../components/types/rolesType";
import api from "./axios";

export const getPermission = () => {
  const response = api.get("/permission");
  return response;
};

export const createPermission = async (data: Permission) => {
  const response = await api.post("/permission", data);
  return response;
};

export const removePermission = async (id: string) => {
  const response = await api.delete(`/permission/${id}`);
  return response;
};

export const editPermission = async (id: string, data: Permission) => {
  const response = await api.patch(`/permission/${id}`, data);
  return response;
};
