"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, UserRole } from "./types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers: Record<UserRole, User> = {
  customer: { id: "user-1", name: "Alex Johnson", email: "alex@example.com", phone: "+16175551234", role: "customer" },
  cook: { id: "cook-1", name: "Chef Marcus", email: "marcus@chefpack.com", phone: "+16175555678", role: "cook" },
  admin: { id: "admin-1", name: "Admin User", email: "admin@chefpack.com", phone: "+16175559999", role: "admin" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return demoUsers.customer;
    const saved = localStorage.getItem("chefpack_user");
    return saved ? JSON.parse(saved) : demoUsers.customer;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return "demo-token";
    return localStorage.getItem("chefpack_token") || "demo-token";
  });
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window === "undefined") return "customer";
    return (localStorage.getItem("chefpack_role") as UserRole) || "customer";
  });

  const login = useCallback(async (_phone: string, _otp: string) => {
    const fakeToken = `demo-token-${Date.now()}`;
    const currentUser = demoUsers[role];
    setToken(fakeToken);
    setUser(currentUser);
    localStorage.setItem("chefpack_token", fakeToken);
    localStorage.setItem("chefpack_user", JSON.stringify(currentUser));
    localStorage.setItem("chefpack_role", role);
  }, [role]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("chefpack_token");
    localStorage.removeItem("chefpack_user");
    localStorage.removeItem("chefpack_role");
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
    const newUser = demoUsers[newRole];
    setUser(newUser);
    localStorage.setItem("chefpack_role", newRole);
    localStorage.setItem("chefpack_user", JSON.stringify(newUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, role, isAuthenticated: !!token, login, logout, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
