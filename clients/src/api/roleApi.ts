import api from "./axios";

export const getPermission = () => {
  const response = api.get("/permission");
  return response;
};

export const createPermission = async (data) => {
  const response = await api.post("/permission", data);
  return response;
};

export const removePermission = async (id: string) => {
  const response = await api.delete(`/permission/${id}`);
  return response;
};
