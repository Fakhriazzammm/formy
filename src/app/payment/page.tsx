'use client';

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PAYMENT_METHODS = [
  { label: "QRIS", value: "qris" },
  { label: "Virtual Account", value: "va" },
  { label: "E-wallet", value: "ewallet" },
];

export default function PaymentPage({ formData }: { formData?: Record<string, string | number | boolean | string[] | undefined> }) {
  const [amount, setAmount] = useState(5000);
  const [method, setMethod] = useState("qris");
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (formData) {
      if (formData.amount !== undefined) setAmount(Number(formData.amount));
      if (formData.method !== undefined) setMethod(String(formData.method));
    }
    if (searchParams.get("success")) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/builder");
      }, 4000);
    }
  }, [formData, searchParams, router]);

  const handlePay = async () => {
    setLoading(true);
    setStatus(null);
    setPaymentUrl(null);
    try {
      const res = await fetch("/api/payment/mayar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method,
          customer,
        }),
      });
      const data = await res.json();
      if (data.payment_url) {
        setPaymentUrl(data.payment_url);
        setStatus("Menunggu pembayaran...");
      } else {
        setStatus("Gagal membuat pembayaran: " + (data.error || ""));
      }
    } catch (e: unknown) {
      setStatus("Gagal: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      {showSuccess && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
            <h2>Pembayaran Berhasil 🎉</h2>
            <p>Anda akan diarahkan ke Form Builder AI...</p>
            <button onClick={() => router.push("/builder")}>Ke Form Builder Sekarang</button>
          </div>
        </div>
      )}
      <h2>Pembayaran</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Nama
          <input value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} style={{ width: "100%" }} />
        </label>
        <label>Email
          <input value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} style={{ width: "100%" }} />
        </label>
        <label>Nominal
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} min={1000} style={{ width: "100%" }} />
        </label>
        <label>Metode Pembayaran
          <select value={method} onChange={e => setMethod(e.target.value)} style={{ width: "100%" }}>
            {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
      </div>
      <button onClick={handlePay} disabled={loading} style={{ background: "#00bcd4", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px" }}>Bayar Sekarang</button>
      {status && <div style={{ marginTop: 16 }}>{status}</div>}
      {paymentUrl && (
        <div style={{ marginTop: 16 }}>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3" }}>Lanjutkan ke pembayaran</a>
        </div>
      )}
    </div>
  );
} 