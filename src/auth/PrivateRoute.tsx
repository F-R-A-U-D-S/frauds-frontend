import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuth } = useContext(AuthContext);
  return isAuth ? children : <Navigate to="/login" replace />;
}
