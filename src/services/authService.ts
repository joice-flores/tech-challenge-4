import { api } from './api';
import { User, UserRole } from '~/types/auth';

interface LoginPayload {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
  };
}

interface WrappedLoginResponse {
  data: LoginPayload;
}

export async function login(email: string, password: string): Promise<LoginPayload> {
  const { data } = await api.post<LoginPayload | WrappedLoginResponse>('/auth/login', {
    email,
    password,
  });
  if ('data' in data && data.data && 'accessToken' in data.data) return data.data;
  return data as LoginPayload;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export function parseUser(raw: LoginPayload['user']): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role ?? 'student',
  };
}
