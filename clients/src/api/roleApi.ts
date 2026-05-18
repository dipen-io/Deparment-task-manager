import api from "./axios";

export const createRole = (data) => {
  const response = api.post("/role", data);
  return response;
};

export const getRole = () => {
  const response = api.get("/role");
  return response;
};
