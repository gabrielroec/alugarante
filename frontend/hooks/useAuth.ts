// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";

const useAuth = (requireAdmin = false) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
        if (requireAdmin && !response.data.isAdmin) {
          router.push("/loginadmin");
        }
      } catch (error) {
        router.push("/loginadmin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, requireAdmin]);

  return { user, loading };
};

export default useAuth;
