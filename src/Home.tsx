import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import './pages/Login.css'
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";
import DownloadPage from "./pages/DownloadPage";

export default function Home() {
  return (
    <Routes>
      <Route
        path="/download"
        element={
          <PublicRoute>
            <DownloadPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
