"use client";

import { useState, useEffect } from "react";
import { getAdminStats } from "@/lib/api";
import type { AdminStats } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList, DollarSign, ChefHat, Users, Shield,
  AlertTriangle, TrendingUp, Calendar,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const statCards = stats
    ? [
        { label: "Orders Today", value: stats.ordersToday, icon: Calendar, color: "bg-primary/10 text-primary", href: "/admin/orders" },
        { label: "Revenue Today", value: `$${stats.revenueToday.toFixed(2)}`, icon: DollarSign, color: "bg-accent/10 text-accent", href: "/admin/orders" },
        { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: ClipboardList, color: "bg-blue-100 text-blue-700", href: "/admin/orders" },
        { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-emerald-100 text-emerald-700", href: "/admin/orders" },
        { label: "Active Cooks", value: stats.activeCooks, icon: ChefHat, color: "bg-orange-100 text-orange-700", href: "/admin/cooks" },
        { label: "Active Customers", value: stats.activeCustomers.toLocaleString(), icon: Users, color: "bg-cyan-100 text-cyan-700", href: "#" },
        { label: "Pending Verifications", value: stats.pendingVerifications, icon: Shield, color: "bg-yellow-100 text-yellow-700", href: "/admin/verifications" },
        { label: "Open Disputes", value: stats.openDisputes, icon: AlertTriangle, color: "bg-red-100 text-red-700", href: "/admin/disputes" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of ChefPack operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : statCards.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/verifications">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-yellow-600" />
                Kitchen Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats?.pendingVerifications || 0} pending review
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/disputes">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Dispute Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats?.openDisputes || 0} open disputes
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/cooks">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ChefHat className="h-5 w-5 text-primary" />
                Cook Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats?.activeCooks || 0} active cooks
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
