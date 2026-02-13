"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { CheckCircle2, Upload, FileText, Camera, ArrowRight } from "lucide-react";

const steps = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Kitchen Details" },
  { id: 3, label: "Documents" },
  { id: 4, label: "Review" },
];

export default function KitchenOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    bio: "",
    kitchenAddress: "",
    kitchenType: "",
    specialties: "",
    healthCertExpiry: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kitchen Onboarding</h1>
        <p className="text-muted-foreground">Complete your profile to start receiving orders</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step.id <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {step.id < currentStep ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                step.id
              )}
            </div>
            <span className="hidden text-sm sm:block">{step.label}</span>
            {i < steps.length - 1 && (
              <div className={`h-px w-8 ${step.id < currentStep ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Tell customers about yourself and your cooking style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your cooking experience and style..."
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                id="specialties"
                placeholder="e.g., Italian, Mexican, Vegan (comma-separated)"
                value={form.specialties}
                onChange={(e) => update("specialties", e.target.value)}
              />
            </div>
            <Button onClick={() => setCurrentStep(2)} className="gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Kitchen Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Kitchen Details</CardTitle>
            <CardDescription>Tell us about your kitchen setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kitchenAddress">Kitchen Address</Label>
              <Input
                id="kitchenAddress"
                placeholder="Enter your kitchen address"
                value={form.kitchenAddress}
                onChange={(e) => update("kitchenAddress", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kitchenType">Kitchen Type</Label>
              <Select
                value={form.kitchenType}
                onValueChange={(v) => update("kitchenType", v)}
              >
                <SelectTrigger id="kitchenType">
                  <SelectValue placeholder="Select kitchen type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Kitchen</SelectItem>
                  <SelectItem value="commercial">Commercial Kitchen</SelectItem>
                  <SelectItem value="shared">Shared Kitchen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
              <Button onClick={() => setCurrentStep(3)} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Documents */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>Upload the required documents for kitchen verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Health Certificate", icon: FileText, desc: "Valid food safety certification" },
              { label: "Kitchen Photos", icon: Camera, desc: "Clear photos of your cooking space" },
              { label: "Food Handler License", icon: FileText, desc: "State-issued food handler permit" },
            ].map((doc) => (
              <div
                key={doc.label}
                className="flex items-center justify-between rounded-lg border border-dashed p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <doc.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.label}</p>
                    <p className="text-sm text-muted-foreground">{doc.desc}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="healthCertExpiry">Health Certificate Expiry Date</Label>
              <Input
                id="healthCertExpiry"
                type="date"
                value={form.healthCertExpiry}
                onChange={(e) => update("healthCertExpiry", e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
              <Button onClick={() => setCurrentStep(4)} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
            <CardDescription>Please review your information before submitting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-lg bg-secondary p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bio</span>
                <span className="text-sm">{form.bio || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Kitchen Address</span>
                <span className="text-sm">{form.kitchenAddress || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Kitchen Type</span>
                <span className="text-sm capitalize">{form.kitchenType || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status="PENDING" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
              <Button onClick={() => alert("Submitted! Your kitchen is now under review.")}>
                Submit for Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
