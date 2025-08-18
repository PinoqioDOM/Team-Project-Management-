import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  fallback,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (!userData) {
    return <Navigate to={redirectTo} replace />;
  }

  const isAdmin = userData.role === 'Admin';
  const isMember = userData.role === 'Member';

  if (requireAdmin && !isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/home" replace />;
  }

  if (!isAdmin && !isMember) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;