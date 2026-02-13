"use client";

import { useState } from "react";
import { CustomerShell } from "@/components/customer-shell";
import { mockGiftCards } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GiftCardsPage() {
  const [amount, setAmount] = useState("25");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <CustomerShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Gift Cards</h1>
          <p className="mt-1 text-muted-foreground">Share the love of great food</p>
        </div>

        <Tabs defaultValue="send">
          <TabsList className="w-full">
            <TabsTrigger value="send" className="flex-1">Send a Gift</TabsTrigger>
            <TabsTrigger value="my-cards" className="flex-1">My Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gift className="h-5 w-5 text-primary" /> Send a Gift Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="flex gap-2">
                    {["15", "25", "50", "75", "100"].map((a) => (
                      <Button key={a} variant={amount === a ? "default" : "outline"} size="sm" onClick={() => setAmount(a)}>
                        ${a}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">{"Recipient's Email"}</Label>
                  <Input id="recipient" type="email" placeholder="friend@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea id="message" placeholder="Enjoy some great food!" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!email}>Send ${amount} Gift Card</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-cards" className="mt-4 space-y-4">
            {mockGiftCards.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <CreditCard className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                <p>No gift cards yet</p>
              </div>
            ) : (
              mockGiftCards.map((gc) => (
                <Card key={gc.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-mono text-sm font-medium">{gc.code}</p>
                      <p className="text-sm text-muted-foreground">To: {gc.recipientEmail}</p>
                      <p className="text-xs text-muted-foreground">Expires: {new Date(gc.expiresAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">${gc.balance.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">of ${gc.amount.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </CustomerShell>
  );
}
