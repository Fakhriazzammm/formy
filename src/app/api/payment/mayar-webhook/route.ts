import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    // Update status pembayaran di DB
    await db.query(`UPDATE payments SET status=$1, updated_at=now() WHERE mayar_order_id=$2`, [status, id]);
    if (status === "paid") {
      // Ambil data pembayaran
      const result = await db.query(`SELECT * FROM payments WHERE mayar_order_id=$1 LIMIT 1`, [id]);
      if (result.rows.length) {
        const row = result.rows[0];
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
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 