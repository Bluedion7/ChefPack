"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getMealById } from "@/lib/api";
import type { Meal } from "@/lib/types";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Clock, Users, Flame, AlertTriangle, Check, ShoppingCart } from "lucide-react";

export default function MealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | undefined>();
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getMealById(id).then((data) => { setMeal(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <CustomerShell>
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          <Skeleton className="aspect-[2/1] w-full rounded-xl" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CustomerShell>
    );
  }

  if (!meal) {
    return (
      <CustomerShell>
        <div className="py-20 text-center text-muted-foreground">Meal not found</div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="aspect-[2/1] overflow-hidden rounded-xl bg-muted">
          <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{meal.name}</h1>
              <Badge>{meal.cookTier === "chef" ? "Chef Tier" : "Cook Tier"}</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">by {meal.cookName}</p>
          </div>
          <p className="text-3xl font-bold text-primary">${meal.price.toFixed(2)}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {meal.rating} ({meal.reviewCount} reviews)</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-muted-foreground" /> {meal.prepTime} min</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground" /> {meal.servings} serving{meal.servings > 1 ? "s" : ""}</span>
          {meal.calories && <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-muted-foreground" /> {meal.calories} cal</span>}
        </div>

        <p className="leading-relaxed text-foreground">{meal.description}</p>

        <div className="flex flex-wrap gap-2">
          {meal.dietaryTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              <Check className="h-3 w-3" /> {tag}
            </Badge>
          ))}
        </div>

        <Separator />

        {/* Allergens & Compatibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Allergen & Compatibility Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Allergens</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {meal.allergens.map((a) => (
                  <Badge key={a} variant={a === "None" ? "secondary" : "destructive"} className="text-xs">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Dietary Tags</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {meal.dietaryTags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add to Order */}
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex items-center gap-2 rounded-lg border px-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(Math.max(1, qty - 1))}>-</Button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(qty + 1)}>+</Button>
            </div>
            <Button className="flex-1 gap-2" onClick={() => router.push("/customer/order/configure")}>
              <ShoppingCart className="h-4 w-4" />
              Add to Order - ${(meal.price * qty).toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </CustomerShell>
  );
}
