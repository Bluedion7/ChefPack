"use client";

import { useState, useEffect, use } from "react";
import { getOrderById } from "@/lib/api";
import type { Order } from "@/lib/types";
import { CustomerShell } from "@/components/customer-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then((data) => { setOrder(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <CustomerShell>
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-60 w-full" />
        </div>
      </CustomerShell>
    );
  }

  if (!order) {
    return <CustomerShell><div className="py-20 text-center text-muted-foreground">Order not found</div></CustomerShell>;
  }

  return (
    <CustomerShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Order #{order.id}</h1>
          <StatusBadge status={order.status} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.meals.map((item) => (
              <div key={item.mealId} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.mealName}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span>${order.deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Service Fee</span><span>${order.serviceFee.toFixed(2)}</span></div>
              {order.tip && <div className="flex justify-between"><span>Tip</span><span>${order.tip.toFixed(2)}</span></div>}
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span><span>${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Cook</span><span>{order.cookName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery Window</span><span>{order.deliveryWindow}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{order.deliveryAddress}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ordered</span><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="flex-1 gap-2" variant="outline" onClick={() => router.push("/customer/reorder")}>
            <RefreshCw className="h-4 w-4" /> Reorder
          </Button>
          {order.status === "DELIVERING" && (
            <Link href={`/customer/orders/${order.id}/track`} className="flex-1">
              <Button className="w-full">Track Order</Button>
            </Link>
          )}
        </div>
      </div>
    </CustomerShell>
  );
}
