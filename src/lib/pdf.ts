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
import { formatPhone, safeFilename, sanitizePdfText } from "./format";

const MARGIN = 14;
const LINE = 5;
const PAD = 8;
const FOOTER_Y = 285;
const MAX_HEADER_HEIGHT = 90;

/** Split on newlines, wrap to width, sanitize for Helvetica. */
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const clean = sanitizePdfText(text);
  if (!clean.trim()) return [];
  const paragraphs = clean.replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const wrapped = doc.splitTextToSize(paragraph || " ", maxWidth) as string[];
    lines.push(...wrapped);
  }
  return lines;
}

function pageHeight(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight();
}

/** Start a new page if `needed` space won't fit above the footer. */
function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  const limit = FOOTER_Y - 12;
  if (y + needed <= limit) return y;
  doc.addPage();
  return MARGIN + 6;
}

function drawFooters(doc: jsPDF): void {
  const total = doc.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Generated with QuoteKit — quotekit-silk.vercel.app",
      width / 2,
      FOOTER_Y,
      { align: "center" }
    );
    if (total > 1) {
      doc.text(`Page ${i} of ${total}`, width - MARGIN, FOOTER_Y, {
        align: "right",
      });
    }
  }
}

export function generateQuotePdf(quote: QuoteData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftColWidth = pageWidth * 0.55 - MARGIN;
  const rightX = pageWidth - MARGIN;

  const businessName = sanitizePdfText(quote.businessName || "Your Business");
  const businessEmail = sanitizePdfText(quote.businessEmail);
  const businessPhone = formatPhone(quote.businessPhone);
  const businessAddress = sanitizePdfText(quote.businessAddress);

  // Measure left column for dynamic header height
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  let nameLines = wrapText(doc, businessName, leftColWidth);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const contactLines: string[] = [];
  if (businessEmail) {
    contactLines.push(...wrapText(doc, businessEmail, leftColWidth));
  }
  if (businessPhone) {
    contactLines.push(...wrapText(doc, businessPhone, leftColWidth));
  }
  contactLines.push(...wrapText(doc, businessAddress, leftColWidth));

  // Cap extremely tall headers (e.g. 20-line address spam)
  let nameLeading = 7;
  let leftBlockHeight =
    nameLines.length * nameLeading +
    (contactLines.length > 0 ? 3 : 0) +
    contactLines.length * LINE;

  const rightBlockHeight = 12 + LINE * 3;
  let headerHeight = Math.max(leftBlockHeight, rightBlockHeight) + PAD * 2;

  // If header is absurdly tall, shrink name font and re-measure
  if (headerHeight > MAX_HEADER_HEIGHT) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    nameLines = wrapText(doc, businessName, leftColWidth);
    nameLeading = 5.5;
    leftBlockHeight =
      nameLines.length * nameLeading +
      (contactLines.length > 0 ? 3 : 0) +
      contactLines.length * LINE;
    headerHeight = Math.min(
      MAX_HEADER_HEIGHT,
      Math.max(leftBlockHeight, rightBlockHeight) + PAD * 2
    );
  }

  // Draw header background
  doc.setFillColor(12, 140, 233);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Left: business name + contact
  let y = PAD + 6;
  const nameFontSize = headerHeight >= MAX_HEADER_HEIGHT - 1 ? 14 : 18;
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(nameFontSize);
  for (const line of nameLines) {
    if (y > headerHeight - 4) break;
    doc.text(line, MARGIN, y);
    y += nameLeading;
  }

  if (contactLines.length > 0) {
    y += 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    for (const line of contactLines) {
      if (y > headerHeight - 3) break;
      doc.text(line, MARGIN, y);
      y += LINE;
    }
  }

  // Right: QUOTE label + meta
  let rightY = PAD + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("QUOTE", rightX, rightY, { align: "right" });
  rightY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const quoteNum = sanitizePdfText(quote.quoteNumber || "—");
  doc.text(`#${quoteNum}`, rightX, rightY, { align: "right" });
  rightY += LINE;
  doc.text(`Date: ${quote.quoteDate || "—"}`, rightX, rightY, {
    align: "right",
  });
  rightY += LINE;
  doc.text(`Valid until: ${quote.validUntil || "—"}`, rightX, rightY, {
    align: "right",
  });

  // Body
  doc.setTextColor(30, 30, 30);
  let bodyY = headerHeight + 14;

  // Guard: if header ate the page, start body on page 2
  if (bodyY > pageHeight(doc) - 60) {
    doc.addPage();
    bodyY = MARGIN + 10;
  }

  if (quote.projectTitle) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    const titleLines = wrapText(
      doc,
      quote.projectTitle,
      pageWidth - MARGIN * 2
    );
    for (const line of titleLines) {
      bodyY = ensureSpace(doc, bodyY, 8);
      doc.text(line, MARGIN, bodyY);
      bodyY += 6;
    }
    bodyY += 4;
  }

  bodyY = ensureSpace(doc, bodyY, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", MARGIN, bodyY);
  bodyY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (quote.clientName) {
    const lines = wrapText(doc, quote.clientName, pageWidth - MARGIN * 2);
    for (const line of lines) {
      bodyY = ensureSpace(doc, bodyY, LINE + 2);
      doc.text(line, MARGIN, bodyY);
      bodyY += LINE;
    }
  }
  if (quote.clientEmail) {
    const lines = wrapText(doc, quote.clientEmail, pageWidth - MARGIN * 2);
    for (const line of lines) {
      bodyY = ensureSpace(doc, bodyY, LINE + 2);
      doc.text(line, MARGIN, bodyY);
      bodyY += LINE;
    }
  }
  if (quote.clientAddress) {
    const clientAddrLines = wrapText(
      doc,
      quote.clientAddress,
      pageWidth - MARGIN * 2
    );
    for (const line of clientAddrLines) {
      bodyY = ensureSpace(doc, bodyY, LINE + 2);
      doc.text(line, MARGIN, bodyY);
      bodyY += LINE;
    }
  }

  bodyY += 8;
  bodyY = ensureSpace(doc, bodyY, 30);

  const rows =
    quote.lineItems.length > 0
      ? quote.lineItems.map((item) => [
          sanitizePdfText(item.description) || "—",
          Number.isFinite(item.quantity) ? String(item.quantity) : "0",
          formatCurrency(item.unitPrice),
          formatCurrency(lineTotal(item)),
        ])
      : [["—", "0", formatCurrency(0), formatCurrency(0)]];

  autoTable(doc, {
    startY: bodyY,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [12, 140, 233] },
    styles: { fontSize: 10, overflow: "linebreak", cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 35 },
      3: { halign: "right", cellWidth: 35 },
    },
    // Keep table out of footer zone
    margin: { left: MARGIN, right: MARGIN, bottom: 24 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finalY = ((doc as any).lastAutoTable?.finalY ?? bodyY) + 10;

  const sub = subtotal(quote.lineItems);
  const tax = taxAmount(quote.lineItems, quote.taxRate);
  const total = grandTotal(quote.lineItems, quote.taxRate);
  const summaryX = pageWidth - MARGIN;
  const summaryBlock = quote.taxRate > 0 ? 22 : 16;

  finalY = ensureSpace(doc, finalY, summaryBlock + 4);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
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
  doc.text(
    `Total: ${formatCurrency(total)}`,
    summaryX,
    finalY + (quote.taxRate > 0 ? 14 : 10),
    { align: "right" }
  );

  if (quote.notes.trim()) {
    let notesY = finalY + (quote.taxRate > 0 ? 28 : 24);
    notesY = ensureSpace(doc, notesY, 16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Notes:", MARGIN, notesY);
    doc.setFont("helvetica", "normal");
    const noteLines = wrapText(doc, quote.notes, pageWidth - MARGIN * 2);
    let noteY = notesY + 6;
    for (const line of noteLines) {
      noteY = ensureSpace(doc, noteY, LINE + 2);
      doc.text(line, MARGIN, noteY);
      noteY += LINE;
    }
  }

  drawFooters(doc);

  const filename = `quote-${safeFilename(quote.quoteNumber)}.pdf`;
  doc.save(filename);
}
