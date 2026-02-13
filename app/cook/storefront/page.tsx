"use client";

import { useState, useEffect } from "react";
import { getMeals } from "@/lib/api";
import type { Meal } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function CookStorefrontPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getMeals().then((data) => {
      setMeals(data.filter((m) => m.cookId === "cook-1"));
      setLoading(false);
    });
  }, []);

  const toggleAvailability = (mealId: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, available: !m.available } : m))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Storefront</h1>
          <p className="text-muted-foreground">Manage your meals and menu</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
              <DialogDescription>Create a new meal for your storefront</DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setDialogOpen(false);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input id="meal-name" placeholder="e.g., Grilled Salmon Bowl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-desc">Description</Label>
                <Textarea id="meal-desc" placeholder="Describe your meal..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meal-price">Price ($)</Label>
                  <Input id="meal-price" type="number" step="0.01" placeholder="16.99" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meal-prep">Prep Time (min)</Label>
                  <Input id="meal-prep" type="number" placeholder="30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-tags">Dietary Tags</Label>
                <Input id="meal-tags" placeholder="e.g., Gluten-Free, Vegan" />
              </div>
              <Button type="submit" className="w-full">Create Meal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          : meals.map((meal) => (
              <Card key={meal.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{meal.name}</h3>
                      {meal.available ? (
                        <StatusBadge status="APPROVED" />
                      ) : (
                        <StatusBadge status="CLOSED" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {meal.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">${meal.price.toFixed(2)}</span>
                      <span>{meal.prepTime} min</span>
                      <span>{meal.dietaryTags.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {meal.available ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={meal.available}
                        onCheckedChange={() => toggleAvailability(meal.id)}
                        aria-label={`Toggle availability for ${meal.name}`}
                      />
                    </div>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit {meal.name}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {!loading && meals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">No meals yet</p>
              <p className="text-sm text-muted-foreground">Add your first meal to start receiving orders</p>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Meal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
