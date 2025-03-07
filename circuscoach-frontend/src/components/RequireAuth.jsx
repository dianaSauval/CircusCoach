import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

function RequireAuth() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAuth;
