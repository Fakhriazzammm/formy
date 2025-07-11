'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="w-full bg-[#5A4EFF] text-white">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image src="/logo.svg" alt="Formy Logo" width={100} height={32} />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium opacity-90 hover:opacity-100">
              Beranda
            </Link>
            <Link href="/builder" className="font-medium opacity-90 hover:opacity-100">
              Builder
            </Link>
            <Link href="/dashboard" className="font-medium opacity-90 hover:opacity-100">
              Dashboard
            </Link>
            <Link href="/payment" className="font-medium opacity-90 hover:opacity-100">
              Pembayaran
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <button className="px-4 py-2 text-white opacity-90 hover:opacity-100">
              Masuk
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="px-4 py-2 bg-white text-[#5A4EFF] rounded-lg font-medium hover:bg-opacity-90">
              Mulai Gratis
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
} 