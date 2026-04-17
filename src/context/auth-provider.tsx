"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import Cookies from "js-cookie";
import { useAxios } from "@/lib/hooks/useAxios";
import { useToast } from "@/lib/store/useToastStore";

  interface User {
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
    isActive: boolean;
    role: {
      roleId: string;
      roleName: string;
    };
  };
  availableAccess?: {
    CreateUser?: boolean;
    CreateUserRole?: boolean;
    DeleteUser?: boolean;
    DeleteUserRole?: boolean;
    UpdateUser?: boolean;
    UpdateUserRole?: boolean;
    ViewUser?: boolean;
    ViewUserRole?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const axiosBase = useAxios()
  const [loading, setLoading] = useState<boolean>(false);
  const { setToast } = useToast();

  const user = useUserStore((state) => state.user);
  const setUserStore = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  // LOGIN
  const login = async (data: { email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await axiosBase.post("/api/auth/login", data);
      const usr = res.data.payload;

      const userData = {
        user: usr.user,
        availableAccess: usr.availableAccess,
      };

      setUserStore(userData);
      setLoading(false)
      router.push("/");
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || "Failed to login", type: "error", open: true });
      setLoading(false)
    }
  };

  // LOGOUT
  const logout = async () => {
    setLoading(true)
    try {
      await axiosBase.post("/api/auth/logout");
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      clearUser();
      router.push("/auth/login");
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
};