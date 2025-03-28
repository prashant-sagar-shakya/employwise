import axios from "axios";

const BASE_URL = "https://reqres.in/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/login", credentials);
    return response.data;
  },
};

export const userService = {
  getUsers: async (page: number = 1) => {
    const response = await api.get<PaginatedResponse<User>>(
      `/users?page=${page}`
    );
    return response.data;
  },

  updateUser: async (id: number, data: UserUpdateData) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
