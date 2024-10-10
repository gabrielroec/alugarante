// components/ProtectedRoute.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/loginadmin");
      } else if (requireAdmin && !user.isAdmin) {
        router.push("/loginadmin");
      }
    }
  }, [user, loading, requireAdmin, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>; // Você pode substituir por um spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
