'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Payment } from '@/types';

export default function PaymentDetailPage() {
  const { slug } = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/payment/detail?slug=${slug}`)
      .then(res => {
        if (res.status === 403) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data?.payment) setPayment(data.payment);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (unauthorized) return <div>Anda tidak berhak mengakses detail pembayaran ini.</div>;
  if (!payment) return <div>Pembayaran tidak ditemukan.</div>;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h2>Status Pembayaran</h2>
      {payment?.customer && (
        <div>Customer: {payment.customer.name} ({payment.customer.email})</div>
      )}
      <div>Email: {payment.customer?.email}</div>
      <div>Nominal: {payment.amount}</div>
      <div>Status: <b>{payment.status}</b></div>
      {payment?.payment_url && (
        <a href={payment.payment_url}>Bayar Sekarang</a>
      )}
    </div>
  );
} 