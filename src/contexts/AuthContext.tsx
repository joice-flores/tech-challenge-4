import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '~/types/auth';
import { setAuthToken, setUnauthorizedHandler } from '~/services/api';
import { getItem, setItem, deleteItem } from '~/services/secureStorage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = useCallback(async (accessToken: string, userData: User) => {
    await setItem(TOKEN_KEY, accessToken);
    await setItem(USER_KEY, JSON.stringify(userData));
    setAuthToken(accessToken);
    setToken(accessToken);
    setUser(userData);
  }, []);

  const updateProfile = useCallback(async (updatedUser: User) => {
    await setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const signOut = useCallback(async () => {
    await deleteItem(TOKEN_KEY);
    await deleteItem(USER_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = await getItem(TOKEN_KEY);
        const storedUser = await getItem(USER_KEY);

        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await signOut();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        isStudent: user?.role === 'student',
        isTeacher: user?.role === 'teacher',
        isAdmin: user?.role === 'admin',
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
