import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // 1. If they are not logged in at all, kick them to the login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If this route requires specific roles, and the user doesn't have it, kick them to the home feed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. If they pass all checks, render the protected page!
  return <Outlet />;
};

export default ProtectedRoute;