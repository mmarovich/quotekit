"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(
          data.error ||
            "Could not start checkout. Stripe may not be set up yet."
        );
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className="btn-primary mt-8 w-full disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to Stripe…
          </>
        ) : (
          <>
            Upgrade to Pro
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      {error && (
        <p className="mt-3 text-center text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
