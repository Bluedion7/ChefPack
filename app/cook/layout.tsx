"use client";

import { SidebarShell } from "@/components/sidebar-shell";
import { Home, ClipboardList, Store, DollarSign, BookOpen, Settings } from "lucide-react";

const cookNav = [
  { href: "/cook/home", label: "Dashboard", icon: Home },
  { href: "/cook/onboarding/kitchen", label: "Onboarding", icon: BookOpen },
  { href: "/cook/storefront", label: "Storefront", icon: Store },
  { href: "/cook/earnings", label: "Earnings", icon: DollarSign },
];

export default function CookLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell navItems={cookNav} title="Cook Portal">{children}</SidebarShell>;
}
