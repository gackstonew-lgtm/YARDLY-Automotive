import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../lib/auth/auth.service';
import type { AuthUser } from '../../lib/auth/session';
import { UserRole } from '../../types/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth verification error in ProtectedRoute:', err);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Non-intrusive loading placeholder matching Adaptive Light/Dark Forest theme
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] flex flex-col items-center justify-center text-[#0F241C] dark:text-[#F2F7F3] p-4">
        <div className="relative flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#121212] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] p-2 flex items-center justify-center animate-pulse shadow-md dark:shadow-glow">
            <img src="/logo.jpeg" alt="Yardly" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div className="w-6 h-6 border-2 border-[#0251B8] dark:border-[#2D7DFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#355347] dark:text-[#8EA79C] tracking-wide uppercase">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated users: redirect to login with intended destination preserved
  if (!user) {
    const intendedPath = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(intendedPath)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // 2. Role-based authorization check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If user is trying to access admin without admin role, redirect to account dashboard
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
