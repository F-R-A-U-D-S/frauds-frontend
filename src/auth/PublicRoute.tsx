import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuth, isAdmin } = useContext(AuthContext);

  if (!isAuth) return children;

  // If logged in, go based on role
  return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/upload" replace />;
}
