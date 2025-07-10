import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { sendEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    // Update status pembayaran di DB
    await executeQuery(`UPDATE payments SET status='${status}', updated_at=now() WHERE mayar_order_id='${id}'`);
    if (status === "paid") {
      // Ambil data pembayaran
      const result = await executeQuery(`SELECT * FROM payments WHERE mayar_order_id='${id}' LIMIT 1`);
      if (result.data.length) {
        const row = result.data[0];
        const customer = row.customer ? JSON.parse(row.customer) : null;
        if (customer?.email) {
          await sendEmail({
            to: customer.email,
            subject: "Pembayaran Berhasil",
            text: `Terima kasih, pembayaran Anda sebesar Rp${row.amount} telah berhasil.`,
          });
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 