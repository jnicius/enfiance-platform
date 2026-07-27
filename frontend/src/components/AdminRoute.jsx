import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const token =
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
