import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FormGen AI - Buat Form Kustom dengan AI',
  description: 'Platform SaaS untuk membuat form kustom dengan bantuan AI, terintegrasi dengan spreadsheet. Bayar hanya Rp 5.000 per link aktif 7 hari.',
  keywords: 'form builder, AI form, custom form, spreadsheet integration, Indonesia',
  authors: [{ name: 'Zantara Technology' }],
  creator: 'Zantara Technology',
  publisher: 'FormGen AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://formgen.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FormGen AI - Buat Form Kustom dengan AI',
    description: 'Platform SaaS untuk membuat form kustom dengan bantuan AI, terintegrasi dengan spreadsheet.',
    url: 'https://formgen.ai',
    siteName: 'FormGen AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FormGen AI - AI-Powered Form Builder',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormGen AI - Buat Form Kustom dengan AI',
    description: 'Platform SaaS untuk membuat form kustom dengan bantuan AI, terintegrasi dengan spreadsheet.',
    images: ['/og-image.png'],
    creator: '@formgenai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
