import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";
import "./pages/Login.css";
import Login from "./pages/Login";
import UploadPage from "./pages/UploadPage";
import DownloadPage from "./pages/DownloadPage";
import SecureDownloadPage from "./pages/SecureDownloadPage";
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

      {/* Secure Download Landing Page (Publicly accessible if token is valid, or Private?) */}
      {/* Assuming it SHOULD be accesssible publicly for the email link flow, OR we force login. 
          Given it's a "Secure Export" sent to email, usually it requires login or the token itself validates access. 
          If the token validates access, it should be PublicRoute or just Route. 
          Let's make it a standard Route for now, or check requirements. 
          "Token expired" implies validation logic is in the token. 
          Often these links are clicked from email on mobile/different device where user might not be logged in.
          Let's use a standard Route wrapper or PublicRoute if it doesn't strictly require session auth beyond the token.
          Actually, let's keep it simple: <Route ... element={<SecureDownloadPage />} /> 
      */}
      <Route
        path="/download/secure"
        element={<SecureDownloadPage />}
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
