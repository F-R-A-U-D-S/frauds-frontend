import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";
import "./pages/Login.css";
import Login from "./pages/Login";
import UploadPage from "./pages/UploadPage";
import DownloadPage from "./pages/DownloadPage";
import Schema from "./Schema";
import { AdminPage } from "./features/userManagement/AdminPage";

export default function App() {
  return (
    <Routes>
      {/* Default route: if authenticated -> /upload, else -> /login */}
      <Route path="/" element={<Navigate to="/upload" replace />} />

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
