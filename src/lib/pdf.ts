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

const MARGIN = 14;
const LINE = 5;
const PAD = 8;

/** Split on newlines, then wrap each line to fit maxWidth. */
function wrapText(
  doc: jsPDF,
  text: string,
  maxWidth: number
): string[] {
  if (!text.trim()) return [];
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const wrapped = doc.splitTextToSize(paragraph || " ", maxWidth) as string[];
    lines.push(...wrapped);
  }
  return lines;
}

export function generateQuotePdf(quote: QuoteData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftColWidth = pageWidth * 0.55 - MARGIN;
  const rightX = pageWidth - MARGIN;

  // Measure left column (business) for dynamic header height
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const nameLines = wrapText(
    doc,
    quote.businessName || "Your Business",
    leftColWidth
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const contactLines: string[] = [];
  if (quote.businessEmail) contactLines.push(quote.businessEmail);
  if (quote.businessPhone) contactLines.push(quote.businessPhone);
  const addressLines = wrapText(doc, quote.businessAddress, leftColWidth);
  contactLines.push(...addressLines);

  // Right column is fixed 4 lines: QUOTE, #, date, valid until
  const rightBlockHeight = 12 + LINE * 3; // title + 3 meta lines
  const leftBlockHeight =
    nameLines.length * 7 + // name uses ~7pt leading at 18pt
    (contactLines.length > 0 ? 3 : 0) +
    contactLines.length * LINE;

  const headerHeight = Math.max(
    leftBlockHeight,
    rightBlockHeight
  ) + PAD * 2;

  // Draw header background
  doc.setFillColor(12, 140, 233);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Left: business name + contact
  let y = PAD + 6;
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  for (const line of nameLines) {
    doc.text(line, MARGIN, y);
    y += 7;
  }

  if (contactLines.length > 0) {
    y += 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    for (const line of contactLines) {
      doc.text(line, MARGIN, y);
      y += LINE;
    }
  }

  // Right: QUOTE label + meta (top-aligned)
  let rightY = PAD + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("QUOTE", rightX, rightY, { align: "right" });
  rightY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`#${quote.quoteNumber}`, rightX, rightY, { align: "right" });
  rightY += LINE;
  doc.text(`Date: ${quote.quoteDate}`, rightX, rightY, { align: "right" });
  rightY += LINE;
  doc.text(`Valid until: ${quote.validUntil}`, rightX, rightY, {
    align: "right",
  });

  // Body content starts below header
  doc.setTextColor(30, 30, 30);
  let bodyY = headerHeight + 14;

  if (quote.projectTitle) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    const titleLines = wrapText(doc, quote.projectTitle, pageWidth - MARGIN * 2);
    for (const line of titleLines) {
      doc.text(line, MARGIN, bodyY);
      bodyY += 6;
    }
    bodyY += 4;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", MARGIN, bodyY);
  bodyY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (quote.clientName) {
    doc.text(quote.clientName, MARGIN, bodyY);
    bodyY += LINE;
  }
  if (quote.clientEmail) {
    doc.text(quote.clientEmail, MARGIN, bodyY);
    bodyY += LINE;
  }
  if (quote.clientAddress) {
    const clientAddrLines = wrapText(doc, quote.clientAddress, 90);
    for (const line of clientAddrLines) {
      doc.text(line, MARGIN, bodyY);
      bodyY += LINE;
    }
  }

  bodyY += 8;

  autoTable(doc, {
    startY: bodyY,
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

  const summaryX = pageWidth - MARGIN;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
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
    doc.text("Notes:", MARGIN, notesY);
    doc.setFont("helvetica", "normal");
    const noteLines = wrapText(doc, quote.notes, pageWidth - MARGIN * 2);
    let noteY = notesY + 6;
    for (const line of noteLines) {
      doc.text(line, MARGIN, noteY);
      noteY += LINE;
    }
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Generated with QuoteKit — quotekit-silk.vercel.app",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  const filename = `quote-${quote.quoteNumber}.pdf`;
  doc.save(filename);
}
