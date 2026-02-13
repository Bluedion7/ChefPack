"use client";

import { useState, useEffect } from "react";
import { getPendingVerifications, approveKitchen, rejectKitchen } from "@/lib/api";
import type { KitchenVerification } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, MapPin, Calendar, Check, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<KitchenVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCook, setSelectedCook] = useState<KitchenVerification | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  useEffect(() => {
    getPendingVerifications().then((data) => {
      setVerifications(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (cookId: string) => {
    await approveKitchen(cookId);
    setVerifications((prev) =>
      prev.map((v) => (v.cookId === cookId ? { ...v, status: "APPROVED" as const } : v))
    );
    setSelectedCook(null);
  };

  const handleReject = async () => {
    if (!selectedCook) return;
    await rejectKitchen(selectedCook.cookId, rejectReason);
    setVerifications((prev) =>
      prev.map((v) =>
        v.cookId === selectedCook.cookId ? { ...v, status: "REJECTED" as const } : v
      )
    );
    setRejectDialogOpen(false);
    setSelectedCook(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kitchen Verifications</h1>
        <p className="text-muted-foreground">Review and approve cook kitchen applications</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : verifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No pending verifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {verifications.map((v) => (
            <Card key={v.cookId}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={v.cookAvatar} alt={v.cookName} />
                      <AvatarFallback>{v.cookName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{v.cookName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted {new Date(v.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={v.status} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{v.kitchenAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{v.kitchenType}</span>
                  </div>
                  {v.healthCertExpiry && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Health cert expires: {v.healthCertExpiry}</span>
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div>
                  <p className="mb-2 text-sm font-medium">Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {v.documents.map((doc) => (
                      <Button key={doc.name} variant="outline" size="sm" className="gap-2">
                        <FileText className="h-3 w-3" />
                        {doc.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {v.notes && (
                  <p className="rounded-lg bg-secondary p-3 text-sm">
                    <span className="font-medium">Notes: </span>{v.notes}
                  </p>
                )}

                {(v.status === "SUBMITTED" || v.status === "UNDER_REVIEW") && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(v.cookId)}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedCook(v);
                        setRejectDialogOpen(true);
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Kitchen Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedCook?.cookName}&apos;s application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Reason</Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Describe the reason for rejection..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
