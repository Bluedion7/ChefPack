"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMeals } from "@/lib/api";
import type { Meal } from "@/lib/types";
import { CustomerShell } from "@/components/customer-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, Star, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["All", "Caribbean", "American", "Thai", "Moroccan", "Mediterranean", "Mexican", "Italian", "Indian"];
const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "High-Protein"];

export default function CustomerHomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  useEffect(() => {
    getMeals().then((data) => { setMeals(data); setLoading(false); });
  }, []);

  const filtered = meals.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory !== "All" && m.category !== activeCategory) return false;
    if (selectedDietary.length && !selectedDietary.some((d) => m.dietaryTags.includes(d))) return false;
    if (m.price < priceRange[0] || m.price > priceRange[1]) return false;
    if (tierFilter && m.cookTier !== tierFilter) return false;
    return true;
  });

  return (
    <CustomerShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-balance md:text-3xl">
            Fresh meals from Boston&apos;s best cooks
          </h1>
          <p className="mt-1 text-muted-foreground">Order home-cooked meals, delivered to your door</p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search meals, cuisines, or cooks..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Dietary</Label>
                  {dietaryOptions.map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <Checkbox
                        id={d}
                        checked={selectedDietary.includes(d)}
                        onCheckedChange={(checked) =>
                          setSelectedDietary(
                            checked
                              ? [...selectedDietary, d]
                              : selectedDietary.filter((x) => x !== d)
                          )
                        }
                      />
                      <Label htmlFor={d} className="text-sm">{d}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                  <Slider min={0} max={30} step={1} value={priceRange} onValueChange={setPriceRange} />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Cook Tier</Label>
                  <div className="flex gap-2">
                    {[null, "cook", "chef"].map((t) => (
                      <Button
                        key={t ?? "all"}
                        variant={tierFilter === t ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTierFilter(t)}
                      >
                        {t === null ? "All" : t === "chef" ? "Chef" : "Cook"}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setSelectedDietary([]);
                    setPriceRange([0, 30]);
                    setTierFilter(null);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              className="shrink-0"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Meals Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-[3/2] w-full rounded-t-lg" />
                <CardContent className="space-y-2 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">No meals found</p>
            <p className="text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((meal) => (
              <Link key={meal.id} href={`/customer/meals/${meal.id}`}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-[3/2] bg-muted">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute right-2 top-2 bg-card text-card-foreground">
                      {meal.cookTier === "chef" ? "Chef" : "Cook"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{meal.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">by {meal.cookName}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-primary">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {meal.rating}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {meal.prepTime}m
                      </span>
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
