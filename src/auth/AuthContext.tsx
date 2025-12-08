import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";


interface AuthContextType {
  isAuth: boolean;
  loading?: boolean;
  isAdmin: boolean;
  login: (token: string, isAdmin: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  loading: true,
  isAdmin: false,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(() => {
    return localStorage.getItem("token") ? true : false;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("is_admin") === "true";
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("is_admin") === "true";
    setIsAuth(!!token);
    setIsAdmin(admin);
    setLoading(false);
  }, []);
  
  const login = (token: string, isAdmin: boolean) => {
    localStorage.setItem("token", token);
    localStorage.setItem("is_admin", String(isAdmin));
    setIsAuth(true);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    setIsAuth(false);
    setIsAdmin(false);
    window.location.href = "/login";
  };

  if (isAuth === null) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isAuth, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
