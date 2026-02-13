"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "./role-switcher";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/customer/home", label: "Home", icon: Home },
  { href: "/customer/favorites", label: "Favorites", icon: Heart },
  { href: "/customer/reorder", label: "Reorder", icon: ShoppingBag },
  { href: "/customer/account", label: "Account", icon: User },
];

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 py-3">
        <Link href="/customer/home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">CP</span>
          </div>
          <span className="text-lg font-bold tracking-tight">ChefPack</span>
        </Link>
        <div className="flex items-center gap-2">
          <RoleSwitcher />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 md:pb-6">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-card px-2 py-2 md:hidden">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
