import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuth } = useContext(AuthContext);
  return isAuth ? <Navigate to="/" replace /> : children;
}
