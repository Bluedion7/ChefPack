"use client";

import { useState, useEffect } from "react";
import { getAdminCooks } from "@/lib/api";
import type { Cook } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ShoppingBag } from "lucide-react";

export default function AdminCooksPage() {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminCooks().then((data) => {
      setCooks(data);
      setLoading(false);
    });
  }, []);

  const filtered = cooks.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cook Management</h1>
        <p className="text-muted-foreground">Manage all registered cooks and chefs</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No cooks match your search</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((cook) => (
            <Card key={cook.id} className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={cook.avatar} alt={cook.name} />
                    <AvatarFallback>{cook.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{cook.name}</h3>
                      <Badge variant={cook.tier === "chef" ? "default" : "secondary"} className="text-xs capitalize">
                        {cook.tier}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{cook.bio}</p>
                  </div>
                  <StatusBadge status={cook.kitchenStatus} />
                </div>

                <div className="flex flex-wrap gap-1">
                  {cook.specialties.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                    {cook.rating} ({cook.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {cook.totalOrders} orders
                  </span>
                  <span>
                    Joined {new Date(cook.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
