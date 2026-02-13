"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function SignInPage() {
  const [phone, setPhone] = useState("+1");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const { login, role } = useAuth();
  const router = useRouter();

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setStep("otp");
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await login(phone, otp);
      const paths = { customer: "/customer/home", cook: "/cook/home", admin: "/admin/dashboard" };
      router.push(paths[role]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <span className="text-xl font-bold text-primary-foreground">CP</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to ChefPack</CardTitle>
          <CardDescription>
            {step === "phone" ? "Enter your phone number to sign in" : "Enter the verification code"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (617) 555-1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSendOTP}>
                Send Verification Code
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2">
                <Label>Verification Code</Label>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">
                  {"Enter any 6 digits for demo"}
                </p>
              </div>
              <Button className="w-full" onClick={handleVerify} disabled={otp.length < 6 || loading}>
                {loading ? "Signing in..." : "Verify & Sign In"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                Change phone number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
