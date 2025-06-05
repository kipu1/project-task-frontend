// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
