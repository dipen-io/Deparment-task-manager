import api from "./axios";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "Employee" | "Admin";
  // Add any other fields your backend returns (e.g., department, status)
}

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await api.get<Employee[]>("/user/employees");
  return res.data;
};

// get users by only admin or dept admin
export const getUsers = async (): Promise<Employee[]> => {
  const res = await api.get<Employee[]>("/user/users");
  return res.data;
};
