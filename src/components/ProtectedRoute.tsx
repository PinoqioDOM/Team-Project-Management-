import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../hooks/usePermissions";

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
  redirectTo = "/login" 
}: ProtectedRouteProps) => {
  const { userData, loading } = useAuth();
  const { isAdmin } = usePermissions();

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (!userData) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireAdmin && !isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;