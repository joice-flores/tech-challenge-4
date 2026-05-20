import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export type UserRole = 'admin' | 'teacher' | 'student';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

interface ApiListResponse {
  success: boolean;
  data: User[];
}

interface ApiSingleResponse {
  success: boolean;
  data: User;
}

function normalizeUser(payload: ApiSingleResponse | User): User {
  if ('data' in payload && payload.data) return payload.data;
  return payload as User;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<ApiListResponse | User[]>('/users');
  if (Array.isArray(data)) return data;
  return data.data;
}

export async function fetchUserById(id: string): Promise<User> {
  const { data } = await api.get<ApiSingleResponse | User>(`/users/${id}`);
  return normalizeUser(data);
}

export async function createUser(data: CreateUserData): Promise<User> {
  const { data: res } = await api.post<ApiSingleResponse | User>('/users', data);
  return normalizeUser(res);
}

export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  const { data: res } = await api.put<ApiSingleResponse | User>(`/users/${id}`, data);
  return normalizeUser(res);
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
