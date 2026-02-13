"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitRating } from "@/lib/api";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" onClick={() => onChange(s)} className="rounded p-0.5 hover:scale-110 transition-transform">
            <Star className={cn("h-6 w-6", s <= value ? "fill-primary text-primary" : "text-muted-foreground/30")} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RatePage() {
  const router = useRouter();
  const [foodQuality, setFoodQuality] = useState(0);
  const [presentation, setPresentation] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [comment, setComment] = useState("");
  const [tip, setTip] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const overall = foodQuality && presentation && accuracy ? Math.round((foodQuality + presentation + accuracy) / 3 * 10) / 10 : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitRating({
      orderId: "ord-1002", cookId: "cook-4",
      foodQuality, presentation, accuracy, overall,
      comment: comment || undefined, tip: tip ? parseFloat(tip) : undefined,
    });
    router.push("/customer/home");
  };

  return (
    <CustomerShell>
      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        <h1 className="text-2xl font-bold">Rate Your Meal</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">How was your order?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StarRating label="Food Quality" value={foodQuality} onChange={setFoodQuality} />
            <StarRating label="Presentation" value={presentation} onChange={setPresentation} />
            <StarRating label="Order Accuracy" value={accuracy} onChange={setAccuracy} />
            {overall > 0 && (
              <p className="text-sm font-medium text-muted-foreground">Overall: {overall} / 5</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comments (optional)</Label>
              <Textarea id="comment" placeholder="Tell us about your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <Label htmlFor="tip">Add a Tip (optional)</Label>
            <div className="flex gap-2">
              {["3", "5", "8"].map((t) => (
                <Button key={t} variant={tip === t ? "default" : "outline"} size="sm" onClick={() => setTip(t)}>
                  ${t}
                </Button>
              ))}
              <Input id="tip" type="number" placeholder="Custom" value={tip} onChange={(e) => setTip(e.target.value)} className="w-24" />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleSubmit} disabled={!foodQuality || !presentation || !accuracy || submitting}>
          {submitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </div>
    </CustomerShell>
  );
}
