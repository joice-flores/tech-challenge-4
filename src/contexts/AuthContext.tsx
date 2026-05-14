import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/auth';

interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  isAuthenticated: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  function signIn(accessToken: string, userData: User) {
    setToken(accessToken);
    setUser(userData);
  }

  function signOut() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
        isAuthenticated: !!token,
        isTeacher: user?.role === 'teacher',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
