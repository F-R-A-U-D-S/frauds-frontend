import { Routes, Route } from "react-router-dom";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";
import './pages/Login.css'
import Login from "./pages/Login";
import UploadPage from "./pages/UploadPage";
import DownloadPage from "./pages/DownloadPage";
import Schema from "./Schema";

export default function App() {
  return (
    <Routes>
      {/* Public page */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* upload and download - Auth-protected */}
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

      {/* Default redirect: if user hits "/", then go to login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
