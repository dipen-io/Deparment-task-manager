import api from "./axios";

export const createRole = (data) => {
  const response = api.post("/role", data);
  return response;
};

export const getRole = () => {
  const response = api.get("/role");
  return response;
};

export const deleteRoles = (roleId) => {
  const response = api.delete(`/role/${roleId}`);
  return response;
};

export const updateRoles = (roleId, data) => {
  const response = api.patch(`/role/${roleId}`, data);
  return response;
};

export const assingUserRole = (roleId, userId) => {
  const response = api.put(`/role/${userId}`, {
    roleId,
  });
  return response;
};
