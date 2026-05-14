import { api } from './api';
import { User, UserRole } from '../types/auth';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}

export function parseUser(raw: LoginResponse['user']): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role ?? 'student',
  };
}
