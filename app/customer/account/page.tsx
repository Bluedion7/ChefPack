"use client";

import { useAuth } from "@/lib/auth-context";
import { mockOrders } from "@/lib/mock-data";
import { CustomerShell } from "@/components/customer-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Crown, History, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <CustomerShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        {/* Profile */}
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/customer/preferences">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <Settings className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Preferences</p>
                  <p className="text-xs text-muted-foreground">Diet, allergies & taste</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/customer/gift-cards">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Payment & Gift Cards</p>
                  <p className="text-xs text-muted-foreground">Manage payment methods</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/customer/group-order">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <Crown className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Membership</p>
                  <p className="text-xs text-muted-foreground">Free delivery & discounts</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-5 w-5" /> Order History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockOrders.map((order) => (
              <Link key={order.id} href={`/customer/orders/${order.id}`}>
                <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-secondary">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{order.cookName}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.meals.map((m) => m.mealName).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Separator />
        <Button variant="outline" className="w-full gap-2 text-destructive" onClick={() => { logout(); router.push("/auth/signin"); }}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </CustomerShell>
  );
}
