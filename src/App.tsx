import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";
import "./pages/Login.css";
import Login from "./pages/Login";
import UploadPage from "./pages/UploadPage";
import DownloadPage from "./pages/DownloadPage";
import Schema from "./Schema";
import { AdminPage } from "./features/userManagement/AdminPage";
import { AuthContext } from "./auth/AuthContext";


function AuthRedirect() {
  const { isAuth, isAdmin } = useContext(AuthContext);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/upload" replace />;
}


export default function App() {
  return (
    <Routes>
      {/* Smart dynamic redirect */}
      <Route path="/" element={<AuthRedirect />} />

      {/* Public login page */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />

      {/* Authenticated user routes */}
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <UploadPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/download"
        element={
          <PrivateRoute>
            <DownloadPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/schema"
        element={
          <PrivateRoute>
            <Schema />
          </PrivateRoute>
        }
      />

      {/* Unknown route -> redirect to default */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
