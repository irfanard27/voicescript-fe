import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useLogin, useRegister, useMe } from "../api/hooks";
import type { RegisterInput, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [initialLoading, setInitialLoading] = useState(true);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const meQuery = useMe(!!token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setInitialLoading(false);
      return;
    }

    if (meQuery.isError) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setInitialLoading(false);
      return;
    }

    if (meQuery.data) {
      setUser(meQuery.data);
      setInitialLoading(false);
    }
  }, [token, meQuery.data, meQuery.isError]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginMutation.mutateAsync({ email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    },
    [loginMutation],
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      const res = await registerMutation.mutateAsync(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    },
    [registerMutation],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading: initialLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
