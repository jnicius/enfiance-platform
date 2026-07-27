import { Navigate } from 'react-router-dom';

import { useAuth }
  from '../context/AuthContext';

export default function ProtectedRoute({
  children,
}) {
  const {
    user,
    loading,
  } = useAuth();

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // -------------------------
  // NOT AUTHENTICATED
  // -------------------------
  if (!user) {
    return <Navigate to="/login" />;
  }

  // -------------------------
  // AUTHENTICATED
  // -------------------------
  return children;
}
