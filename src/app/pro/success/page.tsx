"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Confirming your payment…");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Missing checkout session. Try upgrading again from Pricing.");
      return;
    }

    let cancelled = false;

    async function confirm() {
      try {
        const res = await fetch("/api/stripe/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = (await res.json()) as { error?: string; pro?: boolean };
        if (cancelled) return;
        if (!res.ok || !data.pro) {
          setStatus("error");
          setMessage(data.error || "Could not activate Pro. Contact support.");
          return;
        }
        setStatus("ok");
        setMessage("Pro is active. Unlimited PDF exports are unlocked.");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Network error confirming payment. Try opening Pricing.");
        }
      }
    }

    void confirm();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      {status === "loading" && (
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-600" />
      )}
      {status === "ok" && (
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
      )}
      {status === "error" && (
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
      )}

      <h1 className="mt-6 font-display text-3xl font-bold text-slate-900">
        {status === "loading" && "Activating Pro…"}
        {status === "ok" && "You're on Pro"}
        {status === "error" && "Something went wrong"}
      </h1>
      <p className="mt-3 text-slate-600">{message}</p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/builder" className="btn-primary">
          Open Quote Builder
        </Link>
        <Link href="/pricing" className="btn-secondary">
          Pricing
        </Link>
      </div>
    </div>
  );
}

export default function ProSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
