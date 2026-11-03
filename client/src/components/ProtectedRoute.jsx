import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, getRoleRedirectPath } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mb-3" />
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          Verifying Campus Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, verify access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect user to their own permissible dashboard
    const userHome = getRoleRedirectPath(user.role);
    return <Navigate to={userHome} replace />;
  }

  return children;
}
