"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hydrate } = useAuthStore();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      await sendOtp({ phone });
      setStep("otp");
      setResendTimer(60);
      toast.success("OTP sent to your phone");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp({ phone, otp });
      login(data.access_token, data.refresh_token);

      if (data.is_new_user) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    try {
      await sendOtp({ phone });
      setResendTimer(60);
      setOtp("");
      toast.success("OTP resent");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 text-3xl font-black tracking-tight text-primary">
          CalledIt
        </div>
        <CardTitle className="text-xl">
          {step === "phone" ? "Welcome" : "Enter OTP"}
        </CardTitle>
        <CardDescription>
          {step === "phone"
            ? "Sign in with your phone number to start predicting"
            : `We sent a code to ${phone}`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-muted"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                E.164 format: +country code + number
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="bg-muted text-center text-2xl tracking-[0.5em]"
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Sign In
            </Button>

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend in {resendTimer}s
                </p>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
            >
              Change phone number
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
