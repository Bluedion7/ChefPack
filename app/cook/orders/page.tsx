"use client";

import { useState } from "react";
import { mockOrders } from "@/lib/mock-data";
import { updateOrderStatus } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, ChefHat } from "lucide-react";

const statusFlow: OrderStatus[] = ["CONFIRMED", "PREPARING", "READY"];

function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = statusFlow.indexOf(current);
  if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
  return null;
}

function OrderCard({ order }: { order: Order }) {
  const [status, setStatus] = useState(order.status);
  const next = nextStatus(status);

  const handleAdvance = async () => {
    if (!next) return;
    await updateOrderStatus(order.id, next);
    setStatus(next);
  };

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-medium">#{order.id}</p>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          {order.meals.map((m, i) => (
            <p key={i} className="text-sm">
              {m.quantity}x {m.mealName}
              {m.specialInstructions && (
                <span className="text-muted-foreground"> - {m.specialInstructions}</span>
              )}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {order.deliveryWindow}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {order.deliveryAddress.split(",")[0]}
          </span>
        </div>
        {next && (
          <Button onClick={handleAdvance} size="sm" className="w-full gap-2">
            <ChefHat className="h-4 w-4" />
            Mark as {next.replace(/_/g, " ")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function CookOrdersPage() {
  const allOrders = mockOrders;

  const active = allOrders.filter((o) =>
    ["CONFIRMED", "PREPARING", "READY"].includes(o.status)
  );
  const past = allOrders.filter((o) =>
    ["DELIVERED", "CANCELLED", "PICKED_UP", "DELIVERING"].includes(o.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage your incoming and past orders</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4 space-y-4">
          {active.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No active orders right now</p>
              </CardContent>
            </Card>
          ) : (
            active.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-4 space-y-4">
          {past.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No past orders yet</p>
              </CardContent>
            </Card>
          ) : (
            past.map((order) => (
              <Card key={order.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">#{order.id}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.meals.map((m) => `${m.quantity}x ${m.mealName}`).join(", ")}
                    </p>
                  </div>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
