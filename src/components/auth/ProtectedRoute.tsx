
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredModule?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  requiredModule 
}) => {
  const { isAuthenticated, user } = useAuth();
  const { isModuleEnabled } = usePermissions();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredModule && !isModuleEnabled(requiredModule as any)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
