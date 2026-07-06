import api from "./axios";
import type { Role } from "../components/types/userType";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: {
    timestamps: string;
    unix: number;
    meta: Record<string, unknown>;
  };
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "Employee" | "Admin";
  userType: "member" | "admin" | "head";
  roles: Role;

  // Add any other fields your backend returns (e.g., department, status)
}

export interface EmployeesDataPayload {
    users: Employee[]
    totalUsers?: number; // Optional metadata if you pass it
}


interface UsersResponse {
  data: {
    users: Employee[];
    totalUsers: number;
  };
}

export const getEmployees = async (): Promise<ApiResponse<EmployeesDataPayload>> => {
  const res = await api.get<ApiResponse<EmployeesDataPayload>>("/user/employees");
  return res.data;
};

// get users by only admin or dept admin
// export const getUsers = async (): Promise<UsersResponse[]> => {
//   const res = await api.get<UsersResponse[]>("/user/users");
//   return res.data;
// };
export const getUsers = async (): Promise<UsersResponse> => {
  const res = await api.get<UsersResponse>("/user/employees");
  return res.data;
};
