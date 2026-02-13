"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";

const deliveryWindows = [
  "11:30 AM - 12:00 PM", "12:00 PM - 12:30 PM", "12:30 PM - 1:00 PM",
  "5:30 PM - 6:00 PM", "6:00 PM - 6:30 PM", "6:30 PM - 7:00 PM", "7:00 PM - 7:30 PM",
];

const addOns = [
  { id: "extra-rice", label: "Extra Rice", price: 2.99 },
  { id: "extra-sauce", label: "Extra Sauce", price: 1.49 },
  { id: "utensils", label: "Eco-Friendly Utensils", price: 0.99 },
  { id: "drink", label: "House Lemonade", price: 3.99 },
];

export default function ConfigurePage() {
  const router = useRouter();
  const [tier, setTier] = useState("cook");
  const [window, setWindow] = useState("");
  const [householdSize, setHouseholdSize] = useState("2");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <CustomerShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Configure Your Order</h1>

        {/* Cook Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cook Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={tier} onValueChange={setTier}>
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <RadioGroupItem value="cook" id="cook" className="mt-0.5" />
                <div>
                  <Label htmlFor="cook" className="text-sm font-medium">Cook</Label>
                  <p className="text-xs text-muted-foreground">Home cooks with verified kitchens. Great value meals.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <RadioGroupItem value="chef" id="chef" className="mt-0.5" />
                <div>
                  <Label htmlFor="chef" className="text-sm font-medium">Chef</Label>
                  <p className="text-xs text-muted-foreground">Professionally trained chefs. Premium culinary experience.</p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Delivery Window */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Window</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={window} onValueChange={setWindow}>
              <SelectTrigger><SelectValue placeholder="Choose a delivery window" /></SelectTrigger>
              <SelectContent>
                {deliveryWindows.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Household Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Household Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="household">Number of People</Label>
              <Input
                id="household"
                type="number"
                min="1"
                max="10"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add-ons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add-ons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {addOns.map((addon) => (
              <div key={addon.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={addon.id}
                    checked={selectedAddOns.includes(addon.id)}
                    onCheckedChange={() => toggleAddOn(addon.id)}
                  />
                  <Label htmlFor={addon.id} className="text-sm">{addon.label}</Label>
                </div>
                <span className="text-sm text-muted-foreground">+${addon.price.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button className="w-full gap-2" onClick={() => router.push("/customer/checkout")} disabled={!window}>
          Continue to Checkout <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </CustomerShell>
  );
}
