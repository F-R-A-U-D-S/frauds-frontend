import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";


interface AuthContextType {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(() => {
    return localStorage.getItem("token") ? true : false;
  });

  useEffect(() => {
    localStorage.removeItem("token"); // remove any existing token
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);
  
  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    window.location.href = "/login";
  };

  if (isAuth === null) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
