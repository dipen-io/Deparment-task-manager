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
  createdAt: any;
  _id: string;
  name: string;
  email: string;
  role: "Employee" | "Admin";
  userType: "member" | "admin" | "head";
  roles: Role;
  department: {
    _id: string;
    name: string;
    code: string;
  }

  // Add any other fields your backend returns (e.g., department, status)
}

export interface EmployeesDataPayload {
  users: Employee[]
  totalUsers?: number; // Optional metadata if you pass it
}


interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    users: Employee[];
    totalUsers: number;
  };
  meta: {
    timestamps: string;
    unix: number;
    meta: Record<string, unknown>;
  };
}

export const getEmployees = async (): Promise<ApiResponse<EmployeesDataPayload>> => {
  const res = await api.get<ApiResponse<EmployeesDataPayload>>("/user/employees");
  return res.data;
};

// get users by only admin or dept admin
export const getUsersNormal = async (filters: {}): Promise<UsersResponse> => {
  const res = await api.get<UsersResponse>("/user/users", {
    params: filters
  });
  return res.data;
};


export const getUsers = async (): Promise<UsersResponse> => {
  const res = await api.get<UsersResponse>("/user/employees");
  return res.data;
};

export const getUsersByAdmin = async (deptId: string, deptCode: string) => {
  const res = await api.get("/user/user_member_head", {
    params: {
      deptId,
      deptCode,
    },
  });
  return res.data;
};
