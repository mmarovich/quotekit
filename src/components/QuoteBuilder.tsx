"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Download,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { DEFAULT_QUOTE, EMPTY_LINE_ITEM, type QuoteData } from "@/lib/types";
import {
  formatCurrency,
  grandTotal,
  lineTotal,
  subtotal,
  taxAmount,
} from "@/lib/calculations";
import {
  canExportQuote,
  getQuotesRemaining,
  recordQuoteExport,
  resetUsage,
  FREE_LIMIT,
} from "@/lib/usage";
import { formatPhone, parseClampedNumber } from "@/lib/format";
import {
  type FieldErrors,
  hasErrors,
  normalizeQuote,
  validateQuote,
} from "@/lib/validate";
import { generateQuotePdf } from "@/lib/pdf";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function inputClass(hasError?: boolean) {
  return hasError
    ? "input-field border-red-400 focus:border-red-500 focus:ring-red-500/20"
    : "input-field";
}

export function QuoteBuilder() {
  const [quote, setQuote] = useState<QuoteData>(DEFAULT_QUOTE);
  const [remaining, setRemaining] = useState(FREE_LIMIT);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [exportError, setExportError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reset") === "usage") {
        resetUsage();
        window.history.replaceState({}, "", "/builder");
      }
    }
    setRemaining(getQuotesRemaining());
  }, []);

  function updateField<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    setQuote((prev) => ({ ...prev, [key]: value }));
    // Clear field error as user types
    setErrors((prev) => {
      const next = { ...prev };
      const map: Record<string, keyof FieldErrors> = {
        businessName: "businessName",
        businessEmail: "businessEmail",
        businessPhone: "businessPhone",
        clientName: "clientName",
        clientEmail: "clientEmail",
        quoteDate: "quoteDate",
        validUntil: "validUntil",
      };
      const errKey = map[key as string];
      if (errKey) delete next[errKey];
      delete next.form;
      return next;
    });
    setExportError(null);
  }

  function updateLineItem(
    id: string,
    field: "description" | "quantity" | "unitPrice",
    value: string | number
  ) {
    setQuote((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.lineItems;
      delete next.form;
      return next;
    });
  }

  function addLineItem() {
    setQuote((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, EMPTY_LINE_ITEM()],
    }));
  }

  function removeLineItem(id: string) {
    setQuote((prev) => ({
      ...prev,
      lineItems:
        prev.lineItems.length > 1
          ? prev.lineItems.filter((item) => item.id !== id)
          : prev.lineItems,
    }));
  }

  function handleExport() {
    setExportError(null);

    if (!canExportQuote()) {
      setShowLimitModal(true);
      return;
    }

    const payload = normalizeQuote({
      ...quote,
      taxRate: parseClampedNumber(String(quote.taxRate), {
        min: 0,
        max: 100,
        fallback: 0,
      }),
      lineItems: quote.lineItems.map((item) => ({
        ...item,
        quantity: parseClampedNumber(String(item.quantity), {
          min: 0,
          max: 1_000_000,
          fallback: 0,
        }),
        unitPrice: parseClampedNumber(String(item.unitPrice), {
          min: 0,
          max: 1_000_000_000,
          fallback: 0,
        }),
      })),
    });

    const nextErrors = validateQuote(payload);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setExportError("Fix the highlighted fields, then try again.");
      // Sync normalized phone/email into the form for feedback
      setQuote((prev) => ({
        ...prev,
        businessPhone: payload.businessPhone,
        businessEmail: payload.businessEmail,
        clientEmail: payload.clientEmail,
      }));
      return;
    }

    try {
      generateQuotePdf(payload);
      recordQuoteExport();
      setRemaining(getQuotesRemaining());
      setQuote((prev) => ({
        ...prev,
        businessPhone: payload.businessPhone,
        businessEmail: payload.businessEmail,
        clientEmail: payload.clientEmail,
        businessName: payload.businessName,
        clientName: payload.clientName,
      }));
    } catch {
      setExportError(
        "Something went wrong generating the PDF. Try simplifying long fields and download again."
      );
    }
  }

  const sub = subtotal(quote.lineItems);
  const tax = taxAmount(quote.lineItems, quote.taxRate);
  const total = grandTotal(quote.lineItems, quote.taxRate);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Quote Builder
          </h1>
          <p className="mt-1 text-slate-600">
            Fill in the details, then download a professional PDF.
          </p>
        </div>
        {mounted && (
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
            <Sparkles className="h-4 w-4" />
            {remaining} of {FREE_LIMIT} free exports left this month
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Your Business
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Business Name *</label>
                <input
                  className={inputClass(!!errors.businessName)}
                  value={quote.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  placeholder="Acme Plumbing Co."
                  maxLength={200}
                />
                <FieldError message={errors.businessName} />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input
                  className={inputClass(!!errors.businessEmail)}
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={quote.businessEmail}
                  onChange={(e) => updateField("businessEmail", e.target.value)}
                  onBlur={() =>
                    updateField(
                      "businessEmail",
                      quote.businessEmail.trim().toLowerCase()
                    )
                  }
                  placeholder="you@business.com"
                  maxLength={120}
                />
                <FieldError message={errors.businessEmail} />
              </div>
              <div>
                <label className="label-field">Phone</label>
                <input
                  className={inputClass(!!errors.businessPhone)}
                  type="tel"
                  inputMode="tel"
                  value={quote.businessPhone}
                  onChange={(e) => updateField("businessPhone", e.target.value)}
                  onBlur={() =>
                    updateField("businessPhone", formatPhone(quote.businessPhone))
                  }
                  placeholder="(555) 123-4567"
                  maxLength={40}
                />
                <FieldError message={errors.businessPhone} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Address</label>
                <textarea
                  className="input-field min-h-[72px]"
                  value={quote.businessAddress}
                  onChange={(e) =>
                    updateField("businessAddress", e.target.value)
                  }
                  placeholder={"123 Main St\nSuite 4\nCity, State ZIP"}
                  maxLength={500}
                />
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Client</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Client Name *</label>
                <input
                  className={inputClass(!!errors.clientName)}
                  value={quote.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  placeholder="John Smith"
                  maxLength={200}
                />
                <FieldError message={errors.clientName} />
              </div>
              <div>
                <label className="label-field">Client Email</label>
                <input
                  className={inputClass(!!errors.clientEmail)}
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={quote.clientEmail}
                  onChange={(e) => updateField("clientEmail", e.target.value)}
                  onBlur={() =>
                    updateField(
                      "clientEmail",
                      quote.clientEmail.trim().toLowerCase()
                    )
                  }
                  placeholder="client@email.com"
                  maxLength={120}
                />
                <FieldError message={errors.clientEmail} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Client Address</label>
                <textarea
                  className="input-field min-h-[72px]"
                  value={quote.clientAddress}
                  onChange={(e) => updateField("clientAddress", e.target.value)}
                  placeholder="Client billing address"
                  maxLength={500}
                />
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Quote Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Project Title</label>
                <input
                  className="input-field"
                  value={quote.projectTitle}
                  onChange={(e) => updateField("projectTitle", e.target.value)}
                  placeholder="Kitchen Renovation — Phase 1"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="label-field">Quote Number</label>
                <input
                  className="input-field"
                  value={quote.quoteNumber}
                  onChange={(e) => updateField("quoteNumber", e.target.value)}
                  maxLength={40}
                />
              </div>
              <div>
                <label className="label-field">Tax Rate (%)</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={quote.taxRate}
                  onChange={(e) =>
                    updateField(
                      "taxRate",
                      parseClampedNumber(e.target.value, {
                        min: 0,
                        max: 100,
                        fallback: 0,
                      })
                    )
                  }
                />
              </div>
              <div>
                <label className="label-field">Quote Date</label>
                <input
                  className={inputClass(!!errors.quoteDate)}
                  type="date"
                  value={quote.quoteDate}
                  onChange={(e) => updateField("quoteDate", e.target.value)}
                />
                <FieldError message={errors.quoteDate} />
              </div>
              <div>
                <label className="label-field">Valid Until</label>
                <input
                  className={inputClass(!!errors.validUntil)}
                  type="date"
                  value={quote.validUntil}
                  onChange={(e) => updateField("validUntil", e.target.value)}
                />
                <FieldError message={errors.validUntil} />
              </div>
            </div>
          </section>

          <section className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>
              <button
                type="button"
                onClick={addLineItem}
                className="btn-secondary text-xs"
                disabled={quote.lineItems.length >= 100}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            {errors.lineItems && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {errors.lineItems}
              </p>
            )}

            <div className="space-y-4">
              {quote.lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Item {index + 1}
                    </span>
                    {quote.lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="text-slate-400 transition hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <label className="label-field">Description</label>
                      <input
                        className="input-field"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        placeholder="Labor — 8 hours"
                        maxLength={300}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-field">Qty</label>
                      <input
                        className="input-field"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "quantity",
                            parseClampedNumber(e.target.value, {
                              min: 0,
                              max: 1_000_000,
                              fallback: 0,
                            })
                          )
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-field">Unit Price</label>
                      <input
                        className="input-field"
                        type="text"
                        inputMode="decimal"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "unitPrice",
                            parseClampedNumber(e.target.value, {
                              min: 0,
                              max: 1_000_000_000,
                              fallback: 0,
                            })
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-field">Total</label>
                      <div className="flex h-[38px] items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900">
                        {formatCurrency(lineTotal(item))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {quote.lineItems.length >= 100 && (
              <p className="mt-3 text-xs text-slate-500">
                Max 100 line items per quote.
              </p>
            )}
          </section>

          <section className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Notes</h2>
            <textarea
              className="input-field min-h-[100px]"
              value={quote.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Payment terms, warranty info, or project scope details..."
              maxLength={2000}
            />
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(sub)}</span>
                </div>
                {quote.taxRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({quote.taxRate}%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {(exportError || errors.form) && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {errors.form || exportError}
                </p>
              )}

              <button
                type="button"
                onClick={handleExport}
                className="btn-primary mt-6 w-full"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>

            <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-900">Pro tip</p>
              <p className="mt-1 text-sm text-brand-700">
                Upgrade to Pro for unlimited exports, custom branding, and saved
                clients.{" "}
                <Link href="/pricing" className="font-semibold underline">
                  See pricing
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Free limit reached
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  You&apos;ve used all {FREE_LIMIT} free quote exports this month.
                  Upgrade to Pro for unlimited PDFs, custom branding, and more.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/pricing" className="btn-primary flex-1 text-center">
                    Upgrade to Pro
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowLimitModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
