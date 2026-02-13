"use client";

import { useState, useEffect } from "react";
import { getCookEarnings } from "@/lib/api";
import type { Earning } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";

export default function CookEarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCookEarnings().then((data) => {
      setEarnings(data);
      setLoading(false);
    });
  }, []);

  const totalEarned = earnings.reduce((sum, e) => sum + e.total, 0);
  const totalTips = earnings.reduce((sum, e) => sum + e.tip, 0);
  const pending = earnings.filter((e) => e.status === "PENDING");
  const pendingAmount = pending.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track your income and payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {loading ? <Skeleton className="h-7 w-20" /> : `$${totalEarned.toFixed(2)}`}
              </p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {loading ? <Skeleton className="h-7 w-20" /> : `$${totalTips.toFixed(2)}`}
              </p>
              <p className="text-sm text-muted-foreground">Total Tips</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {loading ? <Skeleton className="h-7 w-20" /> : `$${pendingAmount.toFixed(2)}`}
              </p>
              <p className="text-sm text-muted-foreground">Pending Payout</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Wallet className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {loading ? <Skeleton className="h-7 w-20" /> : earnings.length.toString()}
              </p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-4 border-b pb-2 text-xs font-medium text-muted-foreground">
                <span>Order</span>
                <span>Date</span>
                <span className="text-right">Earnings</span>
                <span className="text-right">Tip</span>
                <span className="text-right">Status</span>
              </div>
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="grid grid-cols-5 items-center gap-4 rounded-lg py-3 text-sm"
                >
                  <span className="font-medium">#{earning.orderId}</span>
                  <span className="text-muted-foreground">{earning.date}</span>
                  <span className="text-right">${earning.amount.toFixed(2)}</span>
                  <span className="text-right text-accent">+${earning.tip.toFixed(2)}</span>
                  <span className="text-right">
                    <StatusBadge status={earning.status} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
