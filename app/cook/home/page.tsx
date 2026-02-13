"use client";

import { useState, useEffect } from "react";
import { getCookOffers } from "@/lib/api";
import { mockOrders } from "@/lib/mock-data";
import type { CookOffer, Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, ChefHat, Clock, Bell } from "lucide-react";
import Link from "next/link";

export default function CookHomePage() {
  const [offers, setOffers] = useState<CookOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const activeOrders = mockOrders.filter((o) => ["CONFIRMED", "PREPARING", "READY"].includes(o.status));

  useEffect(() => {
    getCookOffers().then((data) => { setOffers(data.filter((o) => o.status === "PENDING")); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cook Dashboard</h1>
        <p className="text-muted-foreground">Manage your orders and offers</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{offers.length}</p>
              <p className="text-sm text-muted-foreground">Pending Offers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <ClipboardList className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeOrders.length}</p>
              <p className="text-sm text-muted-foreground">Active Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <ChefHat className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">523</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Offers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Offers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : offers.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No pending offers right now</p>
          ) : (
            offers.map((offer) => (
              <Link key={offer.id} href={`/cook/offers/${offer.id}`}>
                <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary">
                  <div>
                    <p className="font-medium">{offer.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {offer.meals.map((m) => m.mealName).join(", ")}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {offer.deliveryWindow}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${offer.total.toFixed(2)}</p>
                    {offer.tip && <p className="text-xs text-accent">+${offer.tip.toFixed(2)} tip</p>}
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeOrders.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No active orders</p>
          ) : (
            activeOrders.map((order) => (
              <Link key={order.id} href={`/cook/orders/${order.id}`}>
                <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">#{order.id}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.meals.map((m) => `${m.mealName} x${m.quantity}`).join(", ")}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.deliveryWindow}</p>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
