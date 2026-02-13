"use client";

import { SidebarShell } from "@/components/sidebar-shell";
import {
  LayoutDashboard, Shield, ClipboardList, ChefHat, UtensilsCrossed,
  AlertTriangle, Users,
} from "lucide-react";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/verifications", label: "Verifications", icon: Shield },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/cooks", label: "Cooks", icon: ChefHat },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell navItems={adminNav} title="Admin Panel">
      {children}
    </SidebarShell>
  );
}
