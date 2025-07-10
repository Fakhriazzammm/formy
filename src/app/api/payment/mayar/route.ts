import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

const MAYAR_API_KEY = process.env.MAYAR_API_KEY!;
const MAYAR_BASE_URL = "https://api.mayar.id/v2/invoices";

export async function POST(req: NextRequest) {
  try {
    const { amount, method, customer } = await req.json();
    if (!amount || !method || !customer?.name || !customer?.email) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }
    let payment_methods = [];
    if (method === "qris") payment_methods = ["QRIS"];
    else if (method === "va") payment_methods = ["VA_BCA", "VA_BNI", "VA_MANDIRI"];
    else if (method === "ewallet") payment_methods = ["EWALLET_DANA", "EWALLET_OVO", "EWALLET_LINKAJA"];
    else payment_methods = ["QRIS"];

    const body = {
      amount,
      customer: {
        name: customer.name,
        email: customer.email,
      },
      payment_methods,
      description: "Pembayaran Formy",
      success_redirect_url: process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_URL || "https://formy.app/payment/success",
      failure_redirect_url: process.env.NEXT_PUBLIC_PAYMENT_FAILURE_URL || "https://formy.app/payment/failed",
    };

    const res = await fetch(MAYAR_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAYAR_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data?.invoice_url) {
      return NextResponse.json({ error: data?.message || "Gagal membuat pembayaran" }, { status: 500 });
    }
    // Simpan ke database
    const paymentId = randomUUID();
    const slug = paymentId.slice(0, 8);
    await db.query(`INSERT INTO payments (id, mayar_order_id, amount, status, customer, method) VALUES ($1, $2, $3, $4, $5, $6)`, [paymentId, data.id, amount, data.status || 'pending', JSON.stringify(customer), method]);
    await db.query(`INSERT INTO payment_links (id, payment_id, slug) VALUES ($1, $2, $3)`, [randomUUID(), paymentId, slug]);
    return NextResponse.json({ payment_url: data.invoice_url, invoice_id: data.id, slug });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 