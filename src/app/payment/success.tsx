import React from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 32, textAlign: "center" }}>
      <h2>Pembayaran Berhasil 🎉</h2>
      <p>Terima kasih, pembayaran Anda telah berhasil diproses.</p>
      <button
        style={{ marginTop: 24, background: "#0070f3", color: "#fff", border: 0, borderRadius: 8, padding: "12px 32px", fontSize: 18 }}
        onClick={() => router.push("/builder")}
      >
        Lanjut ke Form Builder AI
      </button>
    </div>
  );
} 