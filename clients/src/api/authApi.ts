import api from "./axios";

// Request types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

// Response type (adjust based on your backend)
export interface User {
  id: string;
  email: string;
  // Add other user fields here (e.g., name: string;)
}

export interface AuthResponse {
  user: User; // Moved out of a nested 'data' object
  message: string;
  accessToken: string;
}

// API functions
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  console.log("RESLOGIN: ", res);
  return res.data;
};

export const signupUser = async (
  data: SignupPayload,
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
};
