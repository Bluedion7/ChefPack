"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Crown } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/customer/orders/ord-1001/track");
  };

  return (
    <CustomerShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Jerk Chicken Bowl x 2</p>
                <p className="text-sm text-muted-foreground">by Chef Marcus</p>
              </div>
              <p className="font-medium">$33.98</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Extra Rice</p>
              <p className="text-sm">$2.99</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span><span>$36.97</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Delivery Fee</span><span>$4.99</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Service Fee</span><span>$2.50</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-bold">
              <span>Total</span><span>$44.46</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>123 Beacon St, Boston, MA 02116</p>
            <p className="text-muted-foreground">Window: 6:00 PM - 6:30 PM</p>
          </CardContent>
        </Card>

        {/* Membership Upsell */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Crown className="mt-0.5 h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-semibold">ChefPack Membership</p>
              <p className="text-sm text-muted-foreground">
                Save $4.99 on delivery fees and get 10% off every order. $9.99/month.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0">Try Free</Badge>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Payment integration placeholder - demo mode</p>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={placing}>
          {placing ? "Placing Order..." : "Place Order - $44.46"}
        </Button>
      </div>
    </CustomerShell>
  );
}
