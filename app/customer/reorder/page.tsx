"use client";

import { CustomerShell } from "@/components/customer-shell";
import { mockOrders } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ReorderPage() {
  const pastOrders = mockOrders.filter((o) => o.status === "DELIVERED");

  return (
    <CustomerShell>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Reorder</h1>
          <p className="mt-1 text-muted-foreground">Quick reorder from your past meals</p>
        </div>

        {/* Smart Suggestions */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Suggested for you</p>
              <p className="text-sm text-muted-foreground">Based on your order history and preferences</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm">Pesto Salmon Bowl</Button>
                <Button size="sm" variant="outline">Mushroom Risotto</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Past Orders */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Past Orders</h2>
          {pastOrders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No past orders yet</p>
          ) : (
            pastOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.cookName}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.meals.map((m) => m.mealName).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} &middot; ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <Link href="/customer/order/configure">
                    <Button variant="outline" size="sm" className="gap-1">
                      <RefreshCw className="h-3.5 w-3.5" /> Reorder
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CustomerShell>
  );
}
