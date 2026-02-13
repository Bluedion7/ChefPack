"use client";

import { useState, useEffect, use } from "react";
import { getOrderTracking } from "@/lib/api";
import type { Order } from "@/lib/types";
import { CustomerShell } from "@/components/customer-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusOrder = ["PENDING", "CONFIRMED", "PREPARING", "READY", "PICKED_UP", "DELIVERING", "DELIVERED"];

export default function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderTracking(id).then((data) => { setOrder(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <CustomerShell>
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </CustomerShell>
    );
  }

  if (!order) {
    return <CustomerShell><div className="py-20 text-center text-muted-foreground">Order not found</div></CustomerShell>;
  }

  const currentIndex = statusOrder.indexOf(order.status);

  return (
    <CustomerShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Order #{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          {order.estimatedDelivery && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Arrival</p>
              <p className="text-lg font-bold text-primary">{order.estimatedDelivery}</p>
            </div>
          )}
        </div>

        {/* Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="flex h-48 items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <MapPin className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">Live map tracking</p>
              <p className="text-xs">Coming soon</p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {statusOrder.map((status, i) => {
                const event = order.trackingEvents?.find((e) => e.status === status);
                const isCompleted = i <= currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border-2",
                          isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 bg-card text-muted-foreground"
                        )}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      {i < statusOrder.length - 1 && (
                        <div className={cn("h-8 w-0.5", isCompleted ? "bg-primary" : "bg-muted-foreground/20")} />
                      )}
                    </div>
                    <div className={cn("pb-8", isCurrent && "font-semibold")}>
                      <p className={cn("text-sm", !isCompleted && "text-muted-foreground")}>
                        {status.replace(/_/g, " ")}
                      </p>
                      {event && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {" - "}{event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card>
          <CardContent className="space-y-2 p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Cook</span><span>{order.cookName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{order.deliveryWindow}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{order.deliveryAddress}</span></div>
            <div className="flex justify-between font-medium"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </CardContent>
        </Card>

        {order.status === "DELIVERED" && (
          <Link href="/customer/rate">
            <Button className="w-full">Rate This Order</Button>
          </Link>
        )}
      </div>
    </CustomerShell>
  );
}
