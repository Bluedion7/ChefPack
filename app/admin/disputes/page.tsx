"use client";

import { useState, useEffect } from "react";
import { getAdminDisputes } from "@/lib/api";
import type { Dispute } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, DollarSign, MessageSquare, Calendar } from "lucide-react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDisputes().then((data) => {
      setDisputes(data);
      setLoading(false);
    });
  }, []);

  const open = disputes.filter((d) => d.status === "OPEN");
  const investigating = disputes.filter((d) => d.status === "INVESTIGATING");
  const resolved = disputes.filter((d) => ["RESOLVED", "CLOSED"].includes(d.status));

  const handleResolve = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: "RESOLVED" as const } : d))
    );
  };

  function DisputeCard({ dispute }: { dispute: Dispute }) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">#{dispute.orderId}</h3>
                <StatusBadge status={dispute.status} />
              </div>
              <p className="text-sm text-muted-foreground">{dispute.customerName}</p>
            </div>
            {dispute.refundAmount && (
              <div className="flex items-center gap-1 text-sm font-medium text-destructive">
                <DollarSign className="h-3.5 w-3.5" />
                ${dispute.refundAmount.toFixed(2)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="font-medium">{dispute.reason}</span>
          </div>

          <p className="rounded-lg bg-secondary p-3 text-sm">{dispute.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(dispute.createdAt).toLocaleDateString()}
            </span>
          </div>

          {(dispute.status === "OPEN" || dispute.status === "INVESTIGATING") && (
            <div className="flex gap-2">
              {dispute.status === "OPEN" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setDisputes((prev) =>
                      prev.map((d) =>
                        d.id === dispute.id
                          ? { ...d, status: "INVESTIGATING" as const }
                          : d
                      )
                    )
                  }
                >
                  Start Investigation
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => handleResolve(dispute.id)}
              >
                Mark Resolved
              </Button>
              {dispute.refundAmount && (
                <Button size="sm" variant="destructive">
                  Issue Refund (${dispute.refundAmount.toFixed(2)})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dispute Management</h1>
        <p className="text-muted-foreground">Handle customer complaints and refund requests</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open ({open.length})</TabsTrigger>
            <TabsTrigger value="investigating">
              Investigating ({investigating.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="open" className="mt-4 space-y-4">
            {open.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No open disputes</p>
                </CardContent>
              </Card>
            ) : (
              open.map((d) => <DisputeCard key={d.id} dispute={d} />)
            )}
          </TabsContent>
          <TabsContent value="investigating" className="mt-4 space-y-4">
            {investigating.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No disputes under investigation</p>
                </CardContent>
              </Card>
            ) : (
              investigating.map((d) => <DisputeCard key={d.id} dispute={d} />)
            )}
          </TabsContent>
          <TabsContent value="resolved" className="mt-4 space-y-4">
            {resolved.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No resolved disputes yet</p>
                </CardContent>
              </Card>
            ) : (
              resolved.map((d) => <DisputeCard key={d.id} dispute={d} />)
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
