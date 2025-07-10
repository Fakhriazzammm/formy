import React, { useEffect, useState } from "react";
import { Payment } from '@/types';

export default function PaymentSummary() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    fetch("/api/payment/history")
      .then(res => {
        if (res.status === 401) {
          setIsAuth(false);
          setPayments([]);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data?.payments) setPayments(data.payments);
        setLoading(false);
      });
  }, []);

  if (!isAuth) return <div>Silakan login untuk melihat riwayat pembayaran Anda.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h3>Riwayat Pembayaran</h3>
      {loading && <div>Loading...</div>}
      {!loading && payments.length === 0 && <div>Belum ada pembayaran.</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Nominal</th>
            <th>Status</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              <td>{p.customer?.name}</td>
              <td>{p.customer?.email}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
              <td>{p.slug && <a href={`/payment/${p.slug}`}>Lihat</a>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 