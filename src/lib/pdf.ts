import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { QuoteData } from "./types";
import {
  formatCurrency,
  grandTotal,
  lineTotal,
  subtotal,
  taxAmount,
} from "./calculations";

export function generateQuotePdf(quote: QuoteData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(12, 140, 233);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(quote.businessName || "Your Business", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (quote.businessEmail) doc.text(quote.businessEmail, 14, 26);
  if (quote.businessPhone) doc.text(quote.businessPhone, 14, 31);
  if (quote.businessAddress) {
    const lines = doc.splitTextToSize(quote.businessAddress, 80);
    doc.text(lines, 14, 36);
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("QUOTE", pageWidth - 14, 18, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`#${quote.quoteNumber}`, pageWidth - 14, 26, { align: "right" });
  doc.text(`Date: ${quote.quoteDate}`, pageWidth - 14, 31, { align: "right" });
  doc.text(`Valid until: ${quote.validUntil}`, pageWidth - 14, 36, {
    align: "right",
  });

  doc.setTextColor(30, 30, 30);
  let y = 52;

  if (quote.projectTitle) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(quote.projectTitle, 14, y);
    y += 10;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (quote.clientName) doc.text(quote.clientName, 14, y);
  y += 5;
  if (quote.clientEmail) doc.text(quote.clientEmail, 14, y);
  y += 5;
  if (quote.clientAddress) {
    const lines = doc.splitTextToSize(quote.clientAddress, 90);
    doc.text(lines, 14, y);
    y += lines.length * 5;
  }

  y += 8;

  autoTable(doc, {
    startY: y,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: quote.lineItems.map((item) => [
      item.description || "—",
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(lineTotal(item)),
    ]),
    theme: "striped",
    headStyles: { fillColor: [12, 140, 233] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 35 },
      3: { halign: "right", cellWidth: 35 },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const sub = subtotal(quote.lineItems);
  const tax = taxAmount(quote.lineItems, quote.taxRate);
  const total = grandTotal(quote.lineItems, quote.taxRate);

  const summaryX = pageWidth - 14;
  doc.setFontSize(10);
  doc.text(`Subtotal: ${formatCurrency(sub)}`, summaryX, finalY, {
    align: "right",
  });
  if (quote.taxRate > 0) {
    doc.text(
      `Tax (${quote.taxRate}%): ${formatCurrency(tax)}`,
      summaryX,
      finalY + 6,
      { align: "right" }
    );
  }
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${formatCurrency(total)}`, summaryX, finalY + 14, {
    align: "right",
  });

  if (quote.notes) {
    const notesY = finalY + 28;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, notesY);
    doc.setFont("helvetica", "normal");
    const noteLines = doc.splitTextToSize(quote.notes, pageWidth - 28);
    doc.text(noteLines, 14, notesY + 6);
  }

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Generated with QuoteKit — quotekit.app", pageWidth / 2, 285, {
    align: "center",
  });

  const filename = `quote-${quote.quoteNumber}.pdf`;
  doc.save(filename);
}