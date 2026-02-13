"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, ChefHat, Shield } from "lucide-react";

const roleConfig: { role: UserRole; label: string; icon: typeof User; path: string }[] = [
  { role: "customer", label: "Customer", icon: User, path: "/customer/home" },
  { role: "cook", label: "Cook / Chef", icon: ChefHat, path: "/cook/home" },
  { role: "admin", label: "Admin", icon: Shield, path: "/admin/dashboard" },
];

export function RoleSwitcher() {
  const { role, switchRole } = useAuth();
  const router = useRouter();
  const current = roleConfig.find((r) => r.role === role) || roleConfig[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <current.icon className="h-4 w-4" />
          {current.label}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roleConfig.map((r) => (
          <DropdownMenuItem
            key={r.role}
            onClick={() => {
              switchRole(r.role);
              router.push(r.path);
            }}
            className={role === r.role ? "bg-secondary" : ""}
          >
            <r.icon className="mr-2 h-4 w-4" />
            {r.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
