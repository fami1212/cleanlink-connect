import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

export interface InvoiceOrder {
  id: string;
  client_id: string;
  provider_id: string | null;
  service_type: string;
  address: string;
  final_price: number | null;
  price_min: number | null;
  payment_method: string | null;
  completed_at: string | null;
  created_at: string;
}

const SERVICE_LABELS: Record<string, string> = {
  fosse_septique: "Vidange fosse septique",
  latrines: "Vidange latrines",
  urgence: "Urgence débordement",
  curage: "Curage canalisations",
};

const PAYMENT_LABELS: Record<string, string> = {
  wave: "Wave",
  orange_money: "Orange Money",
  free_money: "Free Money",
  cash: "Espèces",
};

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  amount_ht: number;
  tva_rate: number;
  amount_tva: number;
  amount_ttc: number;
  issued_at: string;
  order_id: string;
}

/** Fetch existing invoice or create a new one, then return record. */
export async function getOrCreateInvoice(order: InvoiceOrder): Promise<InvoiceRecord | null> {
  const client = supabase as any;

  const { data: existing } = await client
    .from("invoices")
    .select("*")
    .eq("order_id", order.id)
    .maybeSingle();
  if (existing) return existing as InvoiceRecord;

  const total = order.final_price || order.price_min || 0;
  const tvaRate = 18;
  const amountHt = Math.round(total / (1 + tvaRate / 100));
  const amountTva = total - amountHt;

  const { data: numberRow } = await client.rpc("next_invoice_number");
  const invoiceNumber = (numberRow as string) || `LKE-${Date.now()}`;

  const { data, error } = await client
    .from("invoices")
    .insert({
      order_id: order.id,
      client_id: order.client_id,
      provider_id: order.provider_id,
      invoice_number: invoiceNumber,
      amount_ht: amountHt,
      tva_rate: tvaRate,
      amount_tva: amountTva,
      amount_ttc: total,
    })
    .select()
    .single();

  if (error) {
    console.error("Invoice creation failed", error);
    return null;
  }
  return data as InvoiceRecord;
}

/** Generate a PDF invoice and trigger download. */
export function downloadInvoicePdf(order: InvoiceOrder, invoice: InvoiceRecord, clientName?: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(16, 185, 129); // emerald
  doc.rect(0, 0, pageW, 28, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Link'eco", 15, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Assainissement certifie ONAS - Senegal", 15, 24);

  // Invoice title
  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FACTURE / RECU", 15, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`N° ${invoice.invoice_number}`, 15, 52);
  doc.text(`Date : ${new Date(invoice.issued_at).toLocaleDateString("fr-FR")}`, 15, 58);

  // Client
  doc.setFont("helvetica", "bold");
  doc.text("Client :", 15, 72);
  doc.setFont("helvetica", "normal");
  doc.text(clientName || "Client Link'eco", 40, 72);
  doc.text(`Adresse : ${order.address}`, 15, 78);

  // Service table
  const y = 95;
  doc.setFillColor(240, 253, 244);
  doc.rect(15, y, pageW - 30, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Service", 18, y + 5.5);
  doc.text("Montant HT", pageW - 55, y + 5.5);

  doc.setFont("helvetica", "normal");
  const serviceLabel = SERVICE_LABELS[order.service_type] || order.service_type;
  doc.text(serviceLabel, 18, y + 15);
  doc.text(`${invoice.amount_ht.toLocaleString("fr-FR")} FCFA`, pageW - 55, y + 15);

  // Totals
  const ty = y + 30;
  doc.line(15, ty, pageW - 15, ty);
  doc.text("Sous-total HT", pageW - 80, ty + 7);
  doc.text(`${invoice.amount_ht.toLocaleString("fr-FR")} FCFA`, pageW - 30, ty + 7, { align: "right" });
  doc.text(`TVA (${invoice.tva_rate}%)`, pageW - 80, ty + 14);
  doc.text(`${invoice.amount_tva.toLocaleString("fr-FR")} FCFA`, pageW - 30, ty + 14, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL TTC", pageW - 80, ty + 24);
  doc.text(`${invoice.amount_ttc.toLocaleString("fr-FR")} FCFA`, pageW - 30, ty + 24, { align: "right" });

  // Payment method
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `Reglement : ${PAYMENT_LABELS[order.payment_method || ""] || "Non renseigne"}`,
    15,
    ty + 40
  );

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    "Link'eco - Plateforme d'assainissement certifiee ONAS - Tous droits reserves",
    pageW / 2,
    285,
    { align: "center" }
  );

  doc.save(`facture-${invoice.invoice_number}.pdf`);
}
