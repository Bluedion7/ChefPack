"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserPreferences, updateUserPreferences } from "@/lib/api";
import type { UserPreferences } from "@/lib/types";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Halal", "Kosher"];
const allergyOptions = ["Peanuts", "Tree Nuts", "Shellfish", "Fish", "Dairy", "Eggs", "Soy", "Wheat", "Sesame"];

export default function PreferencesPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserPreferences().then((data) => { setPrefs(data); setLoading(false); });
  }, []);

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  const handleSave = async () => {
    if (!prefs) return;
    setSaving(true);
    await updateUserPreferences(prefs);
    setSaving(false);
    router.push("/customer/account");
  };

  if (loading || !prefs) {
    return (
      <CustomerShell>
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Your Preferences</h1>

        <Card>
          <CardHeader><CardTitle className="text-base">Dietary Restrictions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {dietaryOptions.map((d) => (
              <div key={d} className="flex items-center gap-2">
                <Checkbox
                  id={`diet-${d}`}
                  checked={prefs.dietaryRestrictions.includes(d)}
                  onCheckedChange={() => setPrefs({ ...prefs, dietaryRestrictions: toggleItem(prefs.dietaryRestrictions, d) })}
                />
                <Label htmlFor={`diet-${d}`} className="text-sm">{d}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Allergies</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {allergyOptions.map((a) => (
              <div key={a} className="flex items-center gap-2">
                <Checkbox
                  id={`allergy-${a}`}
                  checked={prefs.allergies.includes(a)}
                  onCheckedChange={() => setPrefs({ ...prefs, allergies: toggleItem(prefs.allergies, a) })}
                />
                <Label htmlFor={`allergy-${a}`} className="text-sm">{a}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Taste Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><Label>Spice Level</Label><span className="text-muted-foreground">{prefs.tastePreferences.spiceLevel}/5</span></div>
              <Slider min={1} max={5} step={1} value={[prefs.tastePreferences.spiceLevel]} onValueChange={([v]) => setPrefs({ ...prefs, tastePreferences: { ...prefs.tastePreferences, spiceLevel: v } })} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><Label>Sweetness</Label><span className="text-muted-foreground">{prefs.tastePreferences.sweetness}/5</span></div>
              <Slider min={1} max={5} step={1} value={[prefs.tastePreferences.sweetness]} onValueChange={([v]) => setPrefs({ ...prefs, tastePreferences: { ...prefs.tastePreferences, sweetness: v } })} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><Label>Saltiness</Label><span className="text-muted-foreground">{prefs.tastePreferences.saltiness}/5</span></div>
              <Slider min={1} max={5} step={1} value={[prefs.tastePreferences.saltiness]} onValueChange={([v]) => setPrefs({ ...prefs, tastePreferences: { ...prefs.tastePreferences, saltiness: v } })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Household</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="hh-size">Household Size</Label>
              <Input id="hh-size" type="number" min={1} max={10} value={prefs.householdSize} onChange={(e) => setPrefs({ ...prefs, householdSize: parseInt(e.target.value) || 1 })} />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full gap-2" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </CustomerShell>
  );
}
