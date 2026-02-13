"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMeals } from "@/lib/api";
import type { Meal } from "@/lib/types";
import { CustomerShell } from "@/components/customer-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, Heart } from "lucide-react";

export default function FavoritesPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeals().then((data) => { setMeals(data.slice(0, 4)); setLoading(false); });
  }, []);

  return (
    <CustomerShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Your Favorites</h1>
          <p className="mt-1 text-muted-foreground">Meals you love, saved for easy reordering</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><Skeleton className="aspect-[3/2] w-full" /><CardContent className="space-y-2 p-4"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-sm">Heart a meal to save it here</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meals.map((meal) => (
              <Link key={meal.id} href={`/customer/meals/${meal.id}`}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-[3/2] bg-muted">
                    <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
                    <button className="absolute right-2 top-2 rounded-full bg-card p-1.5">
                      <Heart className="h-4 w-4 fill-destructive text-destructive" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{meal.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">by {meal.cookName}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-primary"><Star className="h-3.5 w-3.5 fill-current" /> {meal.rating}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {meal.prepTime}m</span>
                      <span className="ml-auto font-semibold">${meal.price.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {meal.dietaryTags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CustomerShell>
  );
}
