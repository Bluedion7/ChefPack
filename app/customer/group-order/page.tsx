"use client";

import { useState } from "react";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Copy, Check } from "lucide-react";

export default function GroupOrderPage() {
  const [groupName, setGroupName] = useState("");
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareLink = "https://chefpack.com/group/abc123";

  const handleCreate = () => {
    if (groupName) setCreated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CustomerShell>
      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Group Order</h1>
          <p className="mt-1 text-muted-foreground">Order together with friends, family, or coworkers</p>
        </div>

        {!created ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" /> Create a Group Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input id="group-name" placeholder="e.g., Friday Lunch" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={!groupName}>
                Create Group Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="space-y-4 p-4">
                <div className="text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="font-semibold">{groupName}</p>
                  <p className="text-sm text-muted-foreground">Share this link with your group</p>
                </div>
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly className="text-sm" />
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Group Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div>
                    <p className="text-sm font-medium">You (Organizer)</p>
                    <p className="text-xs text-muted-foreground">No items added yet</p>
                  </div>
                  <Button size="sm">Add Items</Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">Waiting for others to join...</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </CustomerShell>
  );
}
